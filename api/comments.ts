/**
 * Comment API services
 */

import { apiClient } from './client';
import type { Comment } from '../types';

/**
 * Get all comments
 */
export const getComments = async (): Promise<Comment[]> => {
  return apiClient.get<Comment[]>('/comment');
};

/**
 * Get single comment by ID
 */
export const getComment = async (id: number): Promise<Comment> => {
  return apiClient.get<Comment>(`/comment/${id}`);
};

/**
 * Get comments by confession
 */
export const getCommentsByConfession = async (confessionId: number): Promise<Comment[]> => {
  return apiClient.get<Comment[]>('/comment_by_confess', { confession_id: confessionId });
};

/**
 * Create new comment
 */
export const createComment = async (data: {
  user: number;
  confession: number;
  content: string;
  like_count?: number;
}): Promise<Comment> => {
  return apiClient.post<Comment>('/comment', {
    ...data,
    like_count: data.like_count || 0,
  });
};

/**
 * Update comment
 */
export const updateComment = async (
  id: number,
  data: { content: string }
): Promise<Comment> => {
  return apiClient.patch<Comment>(`/comment/${id}`, data);
};

/**
 * Delete comment
 */
export const deleteComment = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`/comment/${id}`);
};
