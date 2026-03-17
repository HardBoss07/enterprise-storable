export interface AuthResponse {
  token: string;
  username: string;
  userId: string;
  role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  email: string;
}
