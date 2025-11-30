import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'navigate' | 'accordion' | 'download' | 'external' | 'scroll' | 'openMusicPlayer';
  label: string;
  target: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  history?: { role: string; content: string }[];
}

export interface ChatResponse {
  response: string;
  actions: ChatAction[];
  conversation_id?: string;
}

export interface TranscriptionResponse {
  text: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  // Backend URL - change to production URL when deployed
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  /**
   * Send a chat message to the AI backend
   */
  sendMessage(message: string, conversationId?: string, history?: ChatMessage[]): Observable<ChatResponse> {
    const request: ChatRequest = {
      message,
      conversation_id: conversationId,
      history: history?.map(m => ({ role: m.role, content: m.content }))
    };

    return this.http.post<ChatResponse>(`${this.API_URL}/chat`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Check if the backend is healthy
   */
  healthCheck(): Observable<{ status: string; version: string }> {
    return this.http.get<{ status: string; version: string }>(`${this.API_URL}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Transcribe voice audio using Whisper API
   */
  transcribeVoice(audioBlob: Blob): Observable<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    return this.http.post<TranscriptionResponse>(`${this.API_URL}/voice`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while communicating with the AI assistant.';

    if (error.status === 0) {
      // Network error or CORS issue
      errorMessage = 'Unable to connect to AI assistant. Please check if the backend is running.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please try again.';
    } else if (error.status === 500) {
      errorMessage = 'AI assistant encountered an error. Please try again later.';
    }

    console.error('AI Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
