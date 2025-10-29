import React from 'react';
import type { Category, Subject } from '../types';
import ItemMenu from './ItemMenu';

interface SubjectsPageProps {
  category: Category;
  onSelectSubject: (subjectId: string) => void;
  onBack: () => void;
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
  canModify: (item: any) => boolean;
}

const SubjectCard: React.FC<{subject: Subject, onClick: () => void; onEdit: () => void; onDelete: () => void; canModify: boolean;}> = ({subject, onClick, onEdit, onDelete, canModify}) => {
    const confessionsCount = subject._confession?.length || subject.number_of_confess || 0;
    return (
        <div className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 transform hover:-translate-y-1">
            <div onClick={onClick} className="cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 pr-8">{subject.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-3 space-x-2">
                    <span className="text-xl">🤫</span>
                    <span>{confessionsCount} confession{confessionsCount > 1 ? 's' : ''}</span>
                </div>
            </div>
            {canModify && <ItemMenu onEdit={onEdit} onDelete={onDelete} />}
        </div>
    );
};

const SubjectsPage: React.FC<SubjectsPageProps> = ({ category, onSelectSubject, onBack, onAddSubject, onEditSubject, onDeleteSubject, canModify }) => {
  return (
    <div>
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-5 left-5 w-20 h-20 bg-white/10 rounded-full"></div>
        <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold mb-4 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Retour aux catégories</span>
        </button>
        <h1 className="text-4xl font-extrabold">{category.name}</h1>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sujets</h2>
        {canModify({}) && (
            <button
                onClick={onAddSubject}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold text-sm rounded-full shadow-sm hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                <span>Nouveau sujet</span>
            </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(category._theme_of_category_2 || []).map(subject => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onClick={() => onSelectSubject(subject.id)}
            onEdit={() => onEditSubject(subject)}
            onDelete={() => onDeleteSubject(subject)}
            canModify={canModify(subject)}
          />
        ))}
        {(!category._theme_of_category_2 || category._theme_of_category_2.length === 0) && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucun sujet dans cette catégorie pour le moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;