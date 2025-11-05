import React, { useState, useEffect } from 'react';
import type { Subject } from '../types';

interface SubjectFormData {
  title: string;
  active: boolean;
}

interface AddSubjectFormProps {
  onSubmit: (data: SubjectFormData) => void | Promise<void>;
  onClose: () => void;
  itemToEdit?: Subject;
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onSubmit, onClose, itemToEdit }) => {
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(itemToEdit);

  useEffect(() => {
    if (isEditMode && itemToEdit) {
      setTitle(itemToEdit.name ?? (itemToEdit as any)?.title ?? '');
      if (typeof itemToEdit.Active === 'boolean') {
        setIsActive(itemToEdit.Active);
      }
    }
  }, [itemToEdit, isEditMode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onClose(); // Fermer immediatement
      onSubmit({ title: title.trim(), active: isActive });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isEditMode ? 'Modifier le sujet' : 'Creer un nouveau sujet'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject-title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre du sujet
            </label>
            <input
              id="subject-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex: Ma pire experience au lit"
              className="w-full p-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="text-sm text-gray-700">
                Sujet actif (autorise les confessions)
              </span>
            </label>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all duration-300"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'En cours...' : isEditMode ? 'Enregistrer' : 'Creer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;
