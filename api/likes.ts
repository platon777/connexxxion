/**
 * Likes API services (for both confessions and comments)
 */

import { apiClient } from './client';
import { getDeviceId } from './utils';
import type { ConfessionLike, CommentLike } from '../types';

/**
 * Toggle confession like (like/unlike)
 * Returns whether the confession is now liked
 */
export const toggleConfessionLike = async (confessionId: number): Promise<{ isLiked: boolean }> => {
  const deviceId = getDeviceId();

  const response = await apiClient.post<any>('/confession_like', {
    confession: confessionId,
    device_id: deviceId,
  });

  // Backend returns {value: "removed!!!!!"} when unliked
  const isLiked = response.value !== 'removed!!!!!';

  return { isLiked };
};

/**
 * Toggle comment like (like/unlike)
 * Returns whether the comment is now liked
 */
export const toggleCommentLike = async (commentId: number): Promise<{ isLiked: boolean }> => {
  const deviceId = getDeviceId();

  const response = await apiClient.post<any>('/comment_like', {
    comment: commentId,
    device_id: deviceId,
  });

  // Backend returns {value: "removed!!!!!"} when unliked
  const isLiked = response.value !== 'removed!!!!!';

  return { isLiked };
};

/**
 * Get all confession likes
 */
export const getConfessionLikes = async (): Promise<ConfessionLike[]> => {
  return apiClient.get<ConfessionLike[]>('/confession_like');
};

/**
 * Get all comment likes
 */
export const getCommentLikes = async (): Promise<CommentLike[]> => {
  return apiClient.get<CommentLike[]>('/comment_like');
};

/**
 * Check if user has liked a confession
 */
export const hasLikedConfession = async (confessionId: number): Promise<boolean> => {
  const deviceId = getDeviceId();
  const likes = await getConfessionLikes();
  return likes.some(like => like.confession === confessionId && like.device_id === deviceId);
};

/**
 * Check if user has liked a comment
 */
export const hasLikedComment = async (commentId: number): Promise<boolean> => {
  const deviceId = getDeviceId();
  const likes = await getCommentLikes();
  return likes.some(like => like.comment === commentId && like.device_id === deviceId);
};
