/**
 * Confession API services
 */

import { apiClient } from './client';
import type { Confession } from '../types';

/**
 * Get all confessions
 */
export const getConfessions = async (): Promise<Confession[]> => {
  return apiClient.get<Confession[]>('/confession');
};

/**
 * Get single confession by ID
 */
export const getConfession = async (id: number): Promise<Confession> => {
  return apiClient.get<Confession>(`/confession/${id}`);
};

/**
 * Get confessions by theme
 */
export const getConfessionsByTheme = async (themeId: number): Promise<Confession[]> => {
  return apiClient.get<Confession[]>('/confession_by_theme', { theme_id: themeId });
};

/**
 * Create new confession
 */
export const createConfession = async (data: {
  user: number;
  theme: number;
  title: string;
  content: string;
  view_count?: number;
  like_count?: number;
}): Promise<Confession> => {
  return apiClient.post<Confession>('/confession', {
    ...data,
    view_count: data.view_count || 0,
    like_count: data.like_count || 0,
  });
};

/**
 * Update confession
 */
export const updateConfession = async (
  id: number,
  data: { title?: string; content?: string }
): Promise<Confession> => {
  return apiClient.patch<Confession>(`/confession/${id}`, data);
};

/**
 * Delete confession
 */
export const deleteConfession = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`/confession/${id}`);
};

/**
 * Add confession view
 */
export const addConfessionView = async (confessionId: number, deviceId: string): Promise<void> => {
  return apiClient.post('/confession_view', {
    confession: confessionId,
    device_id: deviceId,
  });
};
