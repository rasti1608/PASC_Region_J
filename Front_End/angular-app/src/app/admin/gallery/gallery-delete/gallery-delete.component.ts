import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { GalleryImage } from '../../models/gallery.model';

@Component({
  selector: 'app-gallery-delete',
  standalone: false,
  templateUrl: './gallery-delete.component.html',
  styleUrls: ['./gallery-delete.component.css']
})
export class GalleryDeleteComponent implements OnInit {
  imageId: number | null = null;
  image: GalleryImage | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.imageId = parseInt(id, 10);
      this.loadImage();
    } else {
      this.router.navigate(['/admin/gallery']);
    }
  }

  loadImage(): void {
    if (!this.imageId) return;

    this.loading = true;
    this.galleryService.getById(this.imageId).subscribe({
      next: (image) => {
        this.image = image;
        this.loading = false;
      },
      error: () => {
        this.error = 'Gallery image not found';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.imageId || this.error) return;

    this.loading = true;
    this.galleryService.delete(this.imageId).subscribe({
      next: () => {
        this.router.navigate(['/admin/gallery']);
      },
      error: (err) => {
        this.error = err.message || 'Failed to delete gallery image';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/gallery']);
  }
}
