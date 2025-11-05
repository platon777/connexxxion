import React, { useEffect, useState } from 'react';
import type { Category, Subject } from '../types';
import ItemMenu from './ItemMenu';

const CONFESSION_ICON = String.fromCodePoint(0x1f347);

interface SubjectsPageProps {
  category: Category;
  onSelectSubject: (subjectId: number) => void;
  onBack: () => void;
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
  canModify: (item: any) => boolean;
  onReorderSubjects?: (orderedIds: number[]) => void;
}

const SubjectCard: React.FC<{
  subject: Subject;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canModify: boolean;
}> = ({ subject, onClick, onEdit, onDelete, canModify }) => {
  const confessionsCount = Array.isArray(subject._confession)
    ? subject._confession.length
    : typeof subject.number_of_confess === 'number'
    ? subject.number_of_confess
    : 0;
  const isActive = subject.Active === undefined ? true : Boolean(subject.Active);
  const statusLabel = isActive ? 'Ouvert' : 'Ferme';
  const statusClasses = isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600';

  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 transform hover:-translate-y-1">
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-start justify-between gap-3 pr-8">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600">{subject.name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>{statusLabel}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-3 space-x-2">
          <span className="text-xl">{CONFESSION_ICON}</span>
          <span>
            {confessionsCount} confession{confessionsCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      {canModify && <ItemMenu onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
};

const moveSubject = (items: Subject[], sourceId: number, targetId: number): Subject[] => {
  const sourceIndex = items.findIndex((item) => item.id === sourceId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) {
    return items;
  }
  const updated = [...items];
  const [moved] = updated.splice(sourceIndex, 1);
  updated.splice(targetIndex, 0, moved);
  return updated;
};

const hasSameOrder = (current: Subject[], next: Subject[]): boolean => {
  if (current.length !== next.length) return false;
  return current.every((item, index) => item.id === next[index]?.id);
};

const SubjectsPage: React.FC<SubjectsPageProps> = ({
  category,
  onSelectSubject,
  onBack,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  canModify,
  onReorderSubjects,
}) => {
  const initialSubjects = Array.isArray(category._theme_of_category_2) ? category._theme_of_category_2 : [];
  const [orderedSubjects, setOrderedSubjects] = useState<Subject[]>(initialSubjects);
  const [draggedSubjectId, setDraggedSubjectId] = useState<number | null>(null);
  const canAdmin = canModify({});
  const allowReorder = Boolean(onReorderSubjects) && canAdmin;

  useEffect(() => {
    setOrderedSubjects(initialSubjects.map((subject) => ({ ...subject })));
  }, [initialSubjects]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, subjectId: number) => {
    if (!allowReorder) return;
    setDraggedSubjectId(subjectId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(subjectId));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!allowReorder) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetId: number) => {
    if (!allowReorder || draggedSubjectId === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (draggedSubjectId === targetId) {
      setDraggedSubjectId(null);
      return;
    }

    const updated = moveSubject(orderedSubjects, draggedSubjectId, targetId);
    setDraggedSubjectId(null);
    if (hasSameOrder(orderedSubjects, updated)) {
      return;
    }

    const updatedWithOrder = updated.map((subject, index) => ({
      ...subject,
      order: index + 1,
    }));
    setOrderedSubjects(updatedWithOrder);
    onReorderSubjects?.(updatedWithOrder.map((subject) => subject.id));
  };

  const handleDragEnd = () => {
    setDraggedSubjectId(null);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-5 left-5 w-20 h-20 bg-white/10 rounded-full"></div>
        <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold mb-4 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Retour aux catégories</span>
        </button>
        <h1 className="text-4xl font-extrabold">{category.name}</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sujets</h2>
        {canAdmin && (
          <button
            onClick={onAddSubject}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold text-sm rounded-full shadow-sm hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Nouveau sujet</span>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderedSubjects.map((subject) => {
          const isDragging = draggedSubjectId === subject.id;
          const draggableProps = allowReorder
            ? {
                draggable: true,
                onDragStart: (event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, subject.id),
                onDragOver: handleDragOver,
                onDrop: (event: React.DragEvent<HTMLDivElement>) => handleDrop(event, subject.id),
                onDragEnd: handleDragEnd,
              }
            : {};

          return (
            <div
              key={subject.id}
              {...draggableProps}
              className={`relative ${allowReorder ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-70' : ''}`}
            >
              {allowReorder && (
                <div className="pointer-events-none select-none absolute left-4 top-4 text-gray-300 text-lg">::</div>
              )}
              <SubjectCard
                subject={subject}
                onClick={() => onSelectSubject(subject.id)}
                onEdit={() => onEditSubject(subject)}
                onDelete={() => onDeleteSubject(subject)}
                canModify={canModify(subject)}
              />
            </div>
          );
        })}
        {orderedSubjects.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun sujet dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
