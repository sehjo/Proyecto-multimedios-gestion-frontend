import api from '@/api/client';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

// Log in. The backend handles the error shape; AuthContext maps it to a message.
export const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch {
    // Logout is best-effort; ignore errors if the endpoint is unavailable.
  }
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};
