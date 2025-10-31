/**
 * Likes API services (for both confessions and comments)
 */

import { apiClient } from './client';
import { getDeviceId } from './utils';

/**
 * Toggle confession like (like/unlike)
 * Returns whether the confession is now liked
 */
export const toggleConfessionLike = async (confessionId: number): Promise<{ isLiked: boolean }> => {
  const deviceId = getDeviceId();

  const response = await apiClient.post<any>('confession', '/confession_like', {
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

  const response = await apiClient.post<any>('comment', '/comment_like', {
    comment: commentId,
    device_id: deviceId,
  });

  // Backend returns {value: "removed!!!!!"} when unliked
  const isLiked = response.value !== 'removed!!!!!';

  return { isLiked };
};
