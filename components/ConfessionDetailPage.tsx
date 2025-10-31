import React, { useState } from 'react';
import type { Confession, Comment } from '../types';
import ItemMenu from './ItemMenu';

const PEACH_ICON = String.fromCodePoint(0x1f351);
const GRAPE_ICON = String.fromCodePoint(0x1f347);
const BOY_ICON = String.fromCodePoint(0x1f466);
const GIRL_ICON = String.fromCodePoint(0x1f467);
const COMMENTS_PER_PAGE = 10;

const getGenderIcon = (sex?: number | string): string => {
  const normalized = typeof sex === 'string' ? parseInt(sex, 10) : sex;
  if (normalized === 1) return BOY_ICON;
  if (normalized === 2) return GIRL_ICON;
  return '';
};

interface ConfessionDetailPageProps {
  confession: Confession;
  onBack: () => void;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (comment: Comment) => void;
  onToggleConfessionLike: (confession: Confession) => void;
  onToggleCommentLike: (comment: Comment) => void;
  canModify: (item: any) => boolean;
}

const CommentCard: React.FC<{
  comment: Comment;
  onEdit: () => void;
  onDelete: () => void;
  onToggleLike: () => void;
  canModify: boolean;
}> = ({ comment, onEdit, onDelete, onToggleLike, canModify }) => {
  const authorName = comment._user_object?.name || 'Anonyme';
  const genderIcon = getGenderIcon(comment._user_object?.sex ?? (comment._user_object as any)?.sexe);
  const formattedDate = new Date(comment.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const isLiked = Boolean(comment._is_liked);
  const likeCount = comment.like_count ?? 0;

  return (
    <div className="relative bg-white p-4 rounded-lg border border-gray-200">
      {canModify && <ItemMenu onEdit={onEdit} onDelete={onDelete} />}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800 flex items-center space-x-2">
              {genderIcon && <span>{genderIcon}</span>}
              <span>{authorName}</span>
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
          <p className="text-gray-600 mt-1">{comment.content}</p>
          <div className="flex items-center space-x-2 mt-3">
            <button
              type="button"
              onClick={onToggleLike}
              className={`group flex items-center space-x-1 text-gray-500 transition-transform duration-200 hover:scale-105 ${isLiked ? 'text-yellow-500' : ''}`}
              aria-label="Aimer ce commentaire"
            >
              <span className="text-lg transition-transform duration-200 group-hover:scale-125">{PEACH_ICON}</span>
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfessionDetailPage: React.FC<ConfessionDetailPageProps> = ({
  confession,
  onBack,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleConfessionLike,
  onToggleCommentLike,
  canModify,
}) => {
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(COMMENTS_PER_PAGE);

  const comments = Array.isArray(confession._comment_of_confession) ? confession._comment_of_confession : [];
  const commentsToShow = comments.slice(0, visibleCommentsCount);
  const confessionGenderIcon = getGenderIcon(confession._user_object?.sex ?? (confession._user_object as any)?.sexe);
  const formattedDate = new Date(confession.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const likeCount = confession.real_like_count ?? confession.like_count ?? 0;
  const isConfessionLiked = Boolean(confession._is_liked);

  const handleLoadMore = () => {
    setVisibleCommentsCount((prev) => prev + COMMENTS_PER_PAGE);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold mb-6 text-gray-500 hover:text-gray-800 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Retour aux confessions</span>
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-yellow-200">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-2">
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg> */}
            {confessionGenderIcon && <span>{confessionGenderIcon}</span>}
            <span>Anonyme</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> */}
            <span>{formattedDate}</span>
          </div>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{confession.content}</p>
        <div className="flex items-center justify-end space-x-6 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onToggleConfessionLike(confession)}
            className={`flex items-center space-x-2 text-gray-500 transition-transform duration-200 hover:scale-105 ${isConfessionLiked ? 'text-yellow-500' : ''}`}
            aria-label="Aimer cette confession"
          >
            <span className="text-2xl">{PEACH_ICON}</span>
            <span className="font-bold">{likeCount}</span>
          </button>
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-2xl">{GRAPE_ICON}</span>
            <span className="font-bold">{comments.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50/60 p-6 sm:p-8 rounded-2xl border border-yellow-200/80">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Commentaires ({comments.length})</h2>
          <button
            onClick={onAddComment}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold text-sm rounded-full shadow-sm hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg> */}
            <span>Commenter</span>
          </button>
        </div>
        <div className="space-y-4">
          {commentsToShow.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onEdit={() => onEditComment(comment)}
              onDelete={() => onDeleteComment(comment)}
              onToggleLike={() => onToggleCommentLike(comment)}
              canModify={canModify(comment)}
            />
          ))}
          {comments.length === 0 && (
            <div className="text-center py-10 bg-white/50 rounded-lg">
              <p className="text-gray-500">Aucun commentaire pour le moment.</p>
              <p className="text-gray-400 text-sm mt-1">Soyez le premier a reagir !</p>
            </div>
          )}
        </div>

        {comments.length > visibleCommentsCount && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-300"
            >
              Charger plus de commentaires
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfessionDetailPage;
