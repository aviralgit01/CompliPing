export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  token: string;
  user: User;
}