export interface User {
  id?: number;
  username: string;
  email: string;
  createdAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
}
