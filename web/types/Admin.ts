export type UserRole = 'USER' | 'ADMIN';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface GlobalSettingsDto {
  trashRetentionDays: number;
  systemTimezone: string;
}
