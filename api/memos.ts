/**
 * Memo API services
 */

import { apiClient } from './client';
import type { Memo } from '../types';

/**
 * Get all memos
 */
export const getMemos = async (): Promise<Memo[]> => {
  return apiClient.get<Memo[]>('confession', '/memo');
};

/**
 * Get single memo by ID
 */
export const getMemo = async (id: number): Promise<Memo> => {
  return apiClient.get<Memo>('confession', `/memo/${id}`);
};

/**
 * Create new memo
 */
export const createMemo = async (data: {
  user_name?: string;
  description: string;
  user?: number;
}): Promise<Memo> => {
  return apiClient.post<Memo>('confession', '/memo', data);
};

/**
 * Update memo
 */
export const updateMemo = async (
  id: number,
  data: Partial<{
    user_name?: string;
    description: string;
  }>
): Promise<Memo> => {
  return apiClient.patch<Memo>('confession', `/memo/${id}`, data);
};

/**
 * Delete memo
 */
export const deleteMemo = async (id: number): Promise<void> => {
  return apiClient.delete<void>('confession', `/memo/${id}`);
};
