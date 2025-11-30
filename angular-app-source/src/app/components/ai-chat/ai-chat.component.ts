import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage, ChatAction } from '../../services/ai.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('waveformCanvas') waveformCanvas!: ElementRef<HTMLCanvasElement>;

  // UI State
  isPanelOpen = signal(false);
  isLoading = signal(false);
  isBackendConnected = signal(false);

  // Voice Recording State
  isRecording = signal(false);
  isTranscribing = signal(false);
  recordingTime = signal('0:00');
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  // Web Audio API for waveform
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private recordingStartTime: number = 0;
  private recordingTimerInterval: ReturnType<typeof setInterval> | null = null;

  // Textarea auto-resize flag
  private needsTextareaResize = false;

  // Chat State
  messages = signal<ChatMessage[]>([]);
  currentMessage = signal('');
  conversationId = signal<string | undefined>(undefined);

  // Computed properties
  hasMessages = computed(() => this.messages().length > 0);

  constructor(
    private aiService: AiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check backend health on init
    this.checkBackendHealth();

    // Add welcome message
    this.addAssistantMessage(
      "Hi! I'm your PASC Region J Conference assistant. Ask me anything about the conference, workshops, registration, or navigate the site!"
    );
  }

  ngOnDestroy(): void {
    // Remove body class when component is destroyed
    document.body.classList.remove('ai-chat-open');
    // Stop any ongoing recording
    this.cleanupRecording();
  }

  ngAfterViewChecked(): void {
    // Auto-resize textarea when needed
    if (this.needsTextareaResize && this.messageInput?.nativeElement) {
      this.resizeTextarea();
      this.needsTextareaResize = false;
    }
  }

  // ========================================
  // VOICE RECORDING METHODS
  // ========================================

  /**
   * Start recording audio with waveform visualization
   */
  async startRecording(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up Web Audio API for waveform visualization
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      // Set up MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
      this.recordingStartTime = Date.now();

      // Start recording timer
      this.startRecordingTimer();

      // Start waveform animation (wait for canvas to be available)
      setTimeout(() => this.drawWaveform(), 50);

      console.log('Recording started with waveform');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.addAssistantMessage(
        "Sorry, I couldn't access your microphone. Please check your browser permissions and try again."
      );
    }
  }

  /**
   * Confirm and send the recording for transcription
   */
  confirmRecording(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.onstop = () => {
        // Process the recorded audio
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.transcribeAudio(audioBlob);
        }
        this.cleanupRecordingResources();
      };

      this.mediaRecorder.stop();
      this.isRecording.set(false);
      console.log('Recording confirmed');
    }
  }

  /**
   * Cancel the recording without transcribing
   */
  cancelRecording(): void {
    this.cleanupRecording();
    console.log('Recording cancelled');
  }

  /**
   * Clean up all recording resources
   */
  private cleanupRecording(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
    }
    this.isRecording.set(false);
    this.cleanupRecordingResources();
  }

  /**
   * Clean up recording resources (audio context, timers, etc.)
   */
  private cleanupRecordingResources(): void {
    // Stop animation
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop timer
    if (this.recordingTimerInterval) {
      clearInterval(this.recordingTimerInterval);
      this.recordingTimerInterval = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordingTime.set('0:00');
  }

  /**
   * Start the recording timer
   */
  private startRecordingTimer(): void {
    this.recordingTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      this.recordingTime.set(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
  }

  /**
   * Draw waveform visualization on canvas
   */
  private drawWaveform(): void {
    if (!this.isRecording() || !this.analyser || !this.waveformCanvas?.nativeElement) {
      return;
    }

    const canvas = this.waveformCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isRecording() || !this.analyser) return;

      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'rgba(13, 21, 32, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4FC3F7';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = 'rgba(79, 195, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }

  /**
   * Send audio to backend for transcription
   */
  private transcribeAudio(audioBlob: Blob): void {
    this.isTranscribing.set(true);

    this.aiService.transcribeVoice(audioBlob).subscribe({
      next: (response) => {
        this.isTranscribing.set(false);
        if (response.text && response.text.trim()) {
          // Append transcribed text to existing input (or set if empty)
          const existing = this.currentMessage().trim();
          const newText = existing ? existing + ' ' + response.text.trim() : response.text.trim();
          this.currentMessage.set(newText);
          // Trigger textarea resize and focus
          this.needsTextareaResize = true;
          setTimeout(() => {
            this.resizeTextarea();
            this.messageInput?.nativeElement?.focus();
          }, 100);
        } else {
          this.addAssistantMessage("I couldn't understand the audio. Please try again.");
        }
      },
      error: (err) => {
        this.isTranscribing.set(false);
        console.error('Transcription error:', err);
        this.addAssistantMessage(
          "Sorry, I couldn't transcribe your voice. Please check if the backend is running and try again."
        );
      }
    });
  }

  /**
   * Check if backend is running
   */
  private checkBackendHealth(): void {
    this.aiService.healthCheck().subscribe({
      next: (response) => {
        this.isBackendConnected.set(response.status === 'healthy');
        console.log('AI Backend connected:', response);
      },
      error: (err) => {
        this.isBackendConnected.set(false);
        console.warn('AI Backend not available:', err.message);
      }
    });
  }

  /**
   * Toggle the chat panel
   */
  togglePanel(): void {
    this.isPanelOpen.update(open => !open);
    this.updateBodyClass();

    // Focus input when panel opens
    if (this.isPanelOpen()) {
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 300);
    }
  }

  /**
   * Close the chat panel
   */
  closePanel(): void {
    this.isPanelOpen.set(false);
    this.updateBodyClass();
  }

  /**
   * Add/remove class on body to push content when panel opens
   */
  private updateBodyClass(): void {
    if (this.isPanelOpen()) {
      document.body.classList.add('ai-chat-open');
    } else {
      document.body.classList.remove('ai-chat-open');
    }
  }

  /**
   * Send a message to the AI
   */
  sendMessage(): void {
    const message = this.currentMessage().trim();
    if (!message || this.isLoading()) return;

    // Add user message to chat
    this.addUserMessage(message);
    this.currentMessage.set('');
    this.isLoading.set(true);

    // Reset textarea height
    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.style.height = 'auto';
    }

    // Send to backend
    this.aiService.sendMessage(message, this.conversationId(), this.messages()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.conversationId.set(response.conversation_id);
        this.addAssistantMessage(response.response, response.actions);
        this.scrollToBottom();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.addAssistantMessage(
          "Sorry, I couldn't process your request. Please check if the backend is running and try again."
        );
        console.error('Chat error:', err);
      }
    });
  }

  /**
   * Handle keyboard events in textarea
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
    // Shift+Enter allows new line (default behavior)
  }

  /**
   * Handle text input and auto-resize textarea
   */
  onTextInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.currentMessage.set(textarea.value);
    this.resizeTextarea();
  }

  /**
   * Auto-resize textarea based on content
   */
  private resizeTextarea(): void {
    const textarea = this.messageInput?.nativeElement;
    if (!textarea) return;

    // Reset height to recalculate
    textarea.style.height = 'auto';

    // Set new height (max 100px)
    const maxHeight = 100;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Show scrollbar if content exceeds max height
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  /**
   * Add a user message to the chat
   */
  private addUserMessage(content: string): void {
    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content,
      timestamp: new Date()
    }]);
    this.scrollToBottom();
  }

  /**
   * Add an assistant message to the chat
   */
  private addAssistantMessage(content: string, actions?: ChatAction[]): void {
    this.messages.update(msgs => [...msgs, {
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions
    }]);
    this.scrollToBottom();
  }

  /**
   * Handle action button click
   */
  executeAction(action: ChatAction, event?: Event): void {
    // Prevent event bubbling that might close panel or cause issues
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (action.type) {
      case 'navigate':
        // Use router.navigate for proper Angular SPA navigation
        this.router.navigate([action.target]);
        this.addAssistantMessage(`Taking you to ${action.label}...`);
        // Keep panel OPEN so user can continue chatting
        break;

      case 'external':
        window.open(action.target, '_blank');
        this.addAssistantMessage(`Opening ${action.label} in a new tab...`);
        break;

      case 'download':
        const link = document.createElement('a');
        link.href = action.target;
        link.download = '';
        link.click();
        this.addAssistantMessage(`Starting download of ${action.label}...`);
        break;

      case 'scroll':
        const element = document.querySelector(action.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          this.addAssistantMessage(`Scrolling to ${action.label}...`);
        }
        break;

      case 'accordion':
        // Navigate and trigger accordion open
        this.router.navigate([action.target]);
        this.addAssistantMessage(`Opening ${action.label}...`);
        break;

      case 'openMusicPlayer':
        // Trigger the floating music player button
        this.openMusicPlayer();
        this.addAssistantMessage(`Opening the music player... 🎵`);
        break;
    }
  }

  /**
   * Open the music player by dispatching a custom event
   * The app component listens for this event and opens the modal
   */
  private openMusicPlayer(): void {
    // Dispatch a custom event that the app component listens for
    window.dispatchEvent(new CustomEvent('openAnthemModal'));
  }

  /**
   * Clear the conversation
   */
  clearConversation(): void {
    this.messages.set([]);
    this.conversationId.set(undefined);
    this.addAssistantMessage(
      "Conversation cleared! How can I help you with the PASC Region J Conference?"
    );
  }

  /**
   * Scroll to the bottom of the messages
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
