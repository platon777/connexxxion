import React, { useState, useEffect } from 'react';
import type { Confession } from '../types';

interface AddConfessionFormProps {
  onSubmit: (content: string) => void;
  onClose: () => void;
  itemToEdit?: Confession;
}

const AddConfessionForm: React.FC<AddConfessionFormProps> = ({ onSubmit, onClose, itemToEdit }) => {
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
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="text-center">
             <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isEditMode ? 'Modifier la confession' : 'Nouvelle Confession'}
             </h2>
             <p className="text-gray-500 mb-6">
                {isEditMode ? 'Corrigez votre secret.' : 'Partagez votre secret en tout anonymat.'}
            </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="confession-content" className="sr-only">Votre confession</label>
            <textarea
              id="confession-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Allez-y, on ne dira rien..."
              className="w-full p-4 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition resize-none"
              rows={8}
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all duration-300">Annuler</button>
            <button type="submit" className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">
                {isEditMode ? 'Enregistrer' : 'Se confesser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConfessionForm;