import React, { useState } from 'react';

interface MemoFormProps {
  onSubmit: (data: { user_name?: string; description: string }) => Promise<void>;
  onClose?: () => void;
}

const MemoForm: React.FC<MemoFormProps> = ({ onSubmit, onClose }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Le memo est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        user_name: userName.trim() || undefined,
        description: description.trim(),
      });

      // Reset form
      setUserName('');
      setDescription('');

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit memo:', error);
      alert('Erreur lors de l\'envoi du memo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 border-2 border-yellow-200">
      <h3 className="text-xl font-semibold text-yellow-900">Laissez-nous un petit mot</h3>
      <p className="text-sm text-gray-600">
        Partagez un message de soutien ou dites-nous ce que vous pensez de Connexxxion !
      </p>

      <div className="space-y-2">
        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
          Votre nom ou pseudo (optionnel)
        </label>
        <input
          type="text"
          id="user_name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Anonyme"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Votre message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Merci pour cette belle plateforme..."
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 text-right">
          {description.length}/500 caractères
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400 text-gray-900 font-semibold py-3 px-6 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi...' : 'Envoyer le memo'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default MemoForm;
