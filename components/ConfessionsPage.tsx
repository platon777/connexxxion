import React from 'react';
import type { Subject, Confession } from '../types';
import ItemMenu from './ItemMenu';

const PEACH_ICON = String.fromCodePoint(0x1F351);
const GRAPE_ICON = String.fromCodePoint(0x1F347);

interface ConfessionsPageProps {
  subject: Subject;
  onSelectConfession: (confessionId: number) => void;
  onBack: () => void;
  onAddConfession: () => void;
  onEditConfession: (confession: Confession) => void;
  onDeleteConfession: (confession: Confession) => void;
  canModify: (item: any) => boolean;
}

const ConfessionCard: React.FC<{
  confession: Confession;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canModify: boolean;
}> = ({ confession, onClick, onEdit, onDelete, canModify }) => {
  const rawComments = confession._comment_of_confession;
  const commentsCount = (() => {
    if (Array.isArray(rawComments)) {
      return rawComments.length;
    }
    if (typeof rawComments === 'number') {
      return rawComments;
    }
    if (rawComments && typeof rawComments === 'object') {
      const resultCandidate = (rawComments as { result1?: unknown; count?: unknown }).result1;
      if (typeof resultCandidate === 'number') {
        return resultCandidate;
      }
      if (Array.isArray(resultCandidate)) {
        return resultCandidate.length;
      }
      const countCandidate = (rawComments as { count?: unknown }).count;
      if (typeof countCandidate === 'number') {
        return countCandidate;
      }
    }
    return confession.comment_count || 0;
  })();

  const likeCount = confession.real_like_count ?? confession.like_count ?? 0;
  const viewCount = confession.view_count ?? 0;
  const authorName = confession._user_object?.name || 'Anonyme';
  const formattedDate = new Date(confession.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-200 hover:border-yellow-300">
      <div onClick={onClick} className="cursor-pointer flex-grow">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{authorName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
        <p className="text-gray-600 flex-grow pr-8">
          {confession.content.length > 150 ? `${confession.content.substring(0, 150)}...` : confession.content}
        </p>
      </div>
      <div className="flex items-center justify-end space-x-4 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-gray-500">
          <span className="text-lg">{PEACH_ICON}</span>
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <span className="text-lg">{GRAPE_ICON}</span>
          <span>{commentsCount}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.93 8.93 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.93 14.07A6.996 6.996 0 0010 15c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6c0 1.31.42 2.522 1.146 3.534l-.474 1.422 1.258-.42z"
              clipRule="evenodd"
            />
          </svg>
          <span>{viewCount}</span>
        </div>
      </div>
      {canModify && <ItemMenu onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
};

const ConfessionsPage: React.FC<ConfessionsPageProps> = ({
  subject,
  onSelectConfession,
  onBack,
  onAddConfession,
  onEditConfession,
  onDeleteConfession,
  canModify,
}) => {
  const confessions = Array.isArray(subject._confession) ? subject._confession : [];
  const confessionsCount = confessions.length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold mb-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour aux sujets</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{subject.name}</h1>
          <p className="text-gray-500 mt-1">{confessionsCount} confession{confessionsCount > 1 ? 's' : ''}</p>
        </div>
        {canModify({}) && (
          <button
            onClick={onAddConfession}
            className="mt-4 md:mt-0 hidden md:flex items-center space-x-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-300 transform hover:scale-105"
          >
            <span>Nouvelle confession</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {confessions.map((confession) => (
          <ConfessionCard
            key={confession.id}
            confession={confession}
            onClick={() => onSelectConfession(confession.id)}
            onEdit={() => onEditConfession(confession)}
            onDelete={() => onDeleteConfession(confession)}
            canModify={canModify(confession)}
          />
        ))}
        {confessions.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">{GRAPE_ICON}</p>
            <p className="text-gray-500 mt-2">Soyez le premier a vous confesser sur ce sujet !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfessionsPage;
