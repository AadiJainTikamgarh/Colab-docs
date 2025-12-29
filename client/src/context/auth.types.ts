export interface User {
  _id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updateAt: Date;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
