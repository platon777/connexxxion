/**
 * Theme API services (called "Subject" in the frontend)
 */

import { apiClient } from './client';
import type { Theme } from '../types';

/**
 * Get all themes
 */
export const getThemes = async (): Promise<Theme[]> => {
  return apiClient.get<Theme[]>('theme', '/theme');
};

/**
 * Get single theme by ID
 */
export const getTheme = async (id: number): Promise<Theme> => {
  return apiClient.get<Theme>('theme', `/theme/${id}`);
};

/**
 * Get themes by category
 */
export const getThemesByCategory = async (categoryId: number): Promise<Theme[]> => {
  return apiClient.get<Theme[]>('theme', '/theme_by_category', { category_id: categoryId });
};

/**
 * Create new theme
 */
export const createTheme = async (data: {
  name: string;
  category?: number;
  description?: string;
  Active?: boolean;
}): Promise<Theme> => {
  return apiClient.post<Theme>('theme', '/theme', data);
};

/**
 * Update theme
 */
export const updateTheme = async (
  id: number,
  data: { name?: string; description?: string; Active?: boolean }
): Promise<Theme> => {
  return apiClient.patch<Theme>('theme', `/theme/${id}`, data);
};

/**
 * Delete theme
 */
export const deleteTheme = async (id: number): Promise<void> => {
  return apiClient.delete<void>('theme', `/theme/${id}`);
};
