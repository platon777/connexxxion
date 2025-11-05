/**
 * Theme API services (called "Subject" in the frontend)
 */

import { apiClient } from './client';
import type { Theme } from '../types';

const sortByOrder = (themes: Theme[]): Theme[] => {
  return [...themes].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const nameA = (a.name ?? '') as string;
    const nameB = (b.name ?? '') as string;
    return nameA.localeCompare(nameB, 'fr', { sensitivity: 'base' });
  });
};

/**
 * Get all themes
 */
export const getThemes = async (): Promise<Theme[]> => {
  const themes = await apiClient.get<Theme[]>('theme', '/theme');
  return sortByOrder(themes);
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
  const themes = await apiClient.get<Theme[]>('theme', '/theme_by_category', { category_id: categoryId });
  return sortByOrder(themes);
};

/**
 * Create new theme
 */
export const createTheme = async (data: {
  name: string;
  category?: number;
  description?: string;
  Active?: boolean;
  order?: number;
}): Promise<Theme> => {
  return apiClient.post<Theme>('theme', '/theme', data);
};

/**
 * Update theme
 */
export const updateTheme = async (
  id: number,
  data: { name?: string; description?: string; Active?: boolean; order?: number }
): Promise<Theme> => {
  return apiClient.patch<Theme>('theme', `/theme/${id}`, data);
};

/**
 * Delete theme
 */
export const deleteTheme = async (id: number): Promise<void> => {
  return apiClient.delete<void>('theme', `/theme/${id}`);
};
