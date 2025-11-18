import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Injectable({
  providedIn: 'root'
})
export class FaviconService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private favicon: HTMLLinkElement | null = null;
  private isRotating = false;
  private rotationAngle = 0;
  private animationFrameId: number | null = null;
  private originalImage: HTMLImageElement | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private audioService: AudioService
  ) {
    this.canvas = this.document.createElement('canvas');
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Initialize the favicon service
   */
  public initialize(): void {
    // Find the favicon link element
    this.favicon = this.document.getElementById('favicon') as HTMLLinkElement;

    if (!this.favicon) {
      console.warn('Favicon element not found');
      return;
    }

    // Load the original image
    this.loadOriginalImage();

    // Subscribe to audio playing state
    this.audioService.isPlaying$.subscribe(isPlaying => {
      if (isPlaying) {
        this.startRotation();
      } else {
        this.stopRotation();
      }
    });
  }

  /**
   * Load the original favicon image
   */
  private loadOriginalImage(): void {
    if (!this.favicon) return;

    this.originalImage = new Image();
    this.originalImage.crossOrigin = 'anonymous';
    this.originalImage.src = this.favicon.href;

    this.originalImage.onload = () => {
      console.log('Favicon image loaded successfully');
    };

    this.originalImage.onerror = () => {
      console.error('Failed to load favicon image');
    };
  }

  /**
   * Start rotating the favicon
   */
  private startRotation(): void {
    if (this.isRotating || !this.originalImage || !this.favicon) return;

    this.isRotating = true;
    this.rotationAngle = 0;
    this.animate();
  }

  /**
   * Stop rotating the favicon
   */
  private stopRotation(): void {
    if (!this.isRotating) return;

    this.isRotating = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Reset to original image
    if (this.favicon && this.originalImage) {
      this.favicon.href = this.originalImage.src;
    }
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isRotating || !this.originalImage || !this.favicon) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context state
    this.ctx.save();

    // Move to center of canvas
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    // Rotate
    this.ctx.rotate((this.rotationAngle * Math.PI) / 180);

    // Draw image centered
    this.ctx.drawImage(
      this.originalImage,
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );

    // Restore context state
    this.ctx.restore();

    // Update favicon
    this.favicon.href = this.canvas.toDataURL('image/png');

    // Increment rotation angle (360 degrees in ~2 seconds at 60fps)
    this.rotationAngle = (this.rotationAngle + 3) % 360;

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Clean up on service destruction
   */
  public ngOnDestroy(): void {
    this.stopRotation();
  }
}
