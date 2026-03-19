export interface AuthResponse {
  token: string;
  username: string;
  email: string;
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
