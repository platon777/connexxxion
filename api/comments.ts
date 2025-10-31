/**
 * Comment API services
 */

import { apiClient } from './client';
import { getDeviceId } from './utils';
import type { Comment } from '../types';
import type { User } from '../types';

interface CommentByConfessResponse {
  result1?: Array<
    Comment & {
      _user_object2?: User;
      _number_like_comment?: number;
      _is_liked_comment?: boolean;
    }
  >;
}

/**
 * Get all comments
 */
export const getComments = async (): Promise<Comment[]> => {
  return apiClient.get<Comment[]>('comment', '/comment');
};

/**
 * Get single comment by ID
 */
export const getComment = async (id: number): Promise<Comment> => {
  return apiClient.get<Comment>('comment', `/comment/${id}`);
};

/**
 * Get comments by confession
 */
export const getCommentsByConfession = async (confessionId: number): Promise<Comment[]> => {
  const response = await apiClient.get<CommentByConfessResponse>('comment', '/comment_by_confess', {
    confession_id: confessionId,
    device_id: getDeviceId(),
  });

  const items = response?.result1 ?? [];

  return items.map(({ _number_like_comment, _user_object2, _is_liked_comment, ...rest }) => ({
    ...rest,
    like_count: _number_like_comment ?? rest.like_count ?? 0,
    _user_object: _user_object2 ?? rest._user_object,
    _is_liked: typeof _is_liked_comment === 'boolean' ? _is_liked_comment : rest._is_liked,
  }));
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
  return apiClient.post<Comment>('comment', '/comment', {
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
  return apiClient.patch<Comment>('comment', `/comment/${id}`, data);
};

/**
 * Delete comment
 */
export const deleteComment = async (id: number): Promise<void> => {
  return apiClient.delete<void>('comment', `/comment/${id}`);
};
