export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  profile_picture: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  password_changed_at: string;
  must_change_password: boolean;
}

export interface Role {
  id: number;
  role_name: string;
  description: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  full_name: string;
  email: string;
  role_id: number;
  is_active: boolean;
}

export interface UpdateUserRequest {
  id: number;
  full_name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  password?: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  email: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}
