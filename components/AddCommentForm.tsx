import React, { useState, useEffect } from 'react';
import type { Comment } from '../types';

interface AddCommentFormProps {
  onSubmit: (content: string) => void;
  onClose: () => void;
  itemToEdit?: Comment;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ onSubmit, onClose, itemToEdit }) => {
  const [content, setContent] = useState('');
  const isEditMode = Boolean(itemToEdit);

  useEffect(() => {
    if (isEditMode) {
      setContent(itemToEdit.content);
    }
  }, [itemToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isEditMode ? 'Modifier le commentaire' : 'Ajouter un commentaire'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
            <textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Exprimez-vous..."
              className="w-full p-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition resize-none"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all duration-300">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">
                {isEditMode ? 'Enregistrer' : 'Commenter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommentForm;
