export interface GalleryImage {
  id: number;
  title: string;
  filename: string;
  original_filename: string;
  file_extension: string;
  file_size: number;
  is_active: boolean;
  page_location: 'about_page' | 'gallery';
  display_order: number;
  uploaded_at: string;
  updated_at: string;
}

export interface GalleryImageFormData {
  title: string;
  page_location: 'about_page' | 'gallery';
  is_active: boolean;
}

export interface GalleryImageUploadData extends GalleryImageFormData {
  image_file: File | null;
}
