export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
  ip_address: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  admin_notes: string;
}

export interface StatusCounts {
  new: number;
  read: number;
  replied: number;
  archived: number;
}
