import client from './client';
import type { ApiResponse, User } from '../types';

interface AuthData {
  user: User;
  token: string;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthData> => {
  const res = await client.post<ApiResponse<AuthData>>('/auth/register', { name, email, password });
  return res.data.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthData> => {
  const res = await client.post<ApiResponse<AuthData>>('/auth/login', { email, password });
  return res.data.data;
};

export const fetchMe = async (): Promise<User> => {
  const res = await client.get<ApiResponse<{ user: User }>>('/auth/me');
  return res.data.data.user;
};
