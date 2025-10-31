/**
 * Authentication API services
 */

import { apiClient } from './client';
import type { AuthResponse, LoginRequest, SignupRequest, User } from '../types';

const USER_DATA_KEY = 'connexxion_user_data';

/**
 * Login with email and password
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth', '/auth/login', credentials);
  apiClient.setAuthToken(response.authToken);
  return response;
};

/**
 * Sign up new user
 */
export const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth', '/auth/signup', userData);
  apiClient.setAuthToken(response.authToken);
  return response;
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<User> => {
  const user = await apiClient.get<User>('auth', '/auth/me');
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  return user;
};

/**
 * Get cached user data
 */
export const getCachedUser = (): User | null => {
  const cached = localStorage.getItem(USER_DATA_KEY);
  return cached ? JSON.parse(cached) : null;
};

/**
 * Logout
 */
export const logout = (): void => {
  apiClient.clearAuthToken();
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return apiClient.isAuthenticated();
};
