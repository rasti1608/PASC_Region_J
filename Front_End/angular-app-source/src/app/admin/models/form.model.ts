export interface Form {
  id: number;
  form_name: string;
  form_description: string | null;
  embed_code: string;
  page_location: 'Workshops' | 'Registration';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FormFormData {
  form_name: string;
  form_description: string | null;
  embed_code: string;
  page_location: 'Workshops' | 'Registration';
  is_active: boolean;
}
