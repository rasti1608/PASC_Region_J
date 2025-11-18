export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  publish_start: string; // Date as ISO string from API
  publish_end: string | null; // Optional end date
  created_by: number;
  created_at: string;
  updated_at: string;
  computed_status?: 'live' | 'inactive' | 'expired' | 'future';
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  is_active: boolean;
  is_featured: boolean;
  publish_start: string;
  publish_end: string | null;
}
