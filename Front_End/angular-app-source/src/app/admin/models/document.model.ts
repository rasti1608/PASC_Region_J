export interface Document {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  original_filename: string;
  file_extension: string;
  file_size: number;
  document_type: string | null;
  is_active: boolean;
  display_order: number;
  uploaded_at: string;
  updated_at: string;
}

export interface DocumentFormData {
  title: string;
  description: string | null;
  document_type: string | null;
  is_active: boolean;
}

export interface DocumentUploadData extends DocumentFormData {
  document_file: File | null;
}
