import React, { useEffect, useState } from 'react';
import type { Memo } from '../types';

interface MemosPageProps {
  onBack: () => void;
  onLoadMemos: () => Promise<Memo[]>;
  onDeleteMemo?: (id: number) => Promise<void>;
}

const MemosPage: React.FC<MemosPageProps> = ({ onBack, onLoadMemos, onDeleteMemo }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    setLoading(true);
    try {
      const data = await onLoadMemos();
      // Trier par date décroissante (plus récent en premier)
      const sortedData = [...data].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setMemos(sortedData);
    } catch (error) {
      console.error('Failed to load memos:', error);
      alert('Erreur lors du chargement des memos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!onDeleteMemo) return;

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce memo ?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await onDeleteMemo(id);
      await loadMemos();
    } catch (error) {
      console.error('Failed to delete memo:', error);
      alert('Erreur lors de la suppression du memo');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sm font-semibold mb-4 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Messages de soutien</h1>
          <p className="text-gray-500 mt-1">{memos.length} message{memos.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={loadMemos}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all duration-300"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {loading && memos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-600">Chargement des messages...</p>
          </div>
        </div>
      ) : memos.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-lg">Aucun message pour le moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 relative"
            >
              {/* Header avec nom et date */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="font-semibold text-gray-800">
                      {memo.user_name || 'Anonyme'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(memo.created_at)}</p>
                </div>

                {/* Bouton supprimer */}
                {onDeleteMemo && (
                  <button
                    onClick={() => handleDelete(memo.id)}
                    disabled={deletingId === memo.id}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Message */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{memo.description}</p>
              </div>

              {/* Badge ID (pour référence admin) */}
              <div className="mt-3 text-xs text-gray-400">
                ID: {memo.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemosPage;
