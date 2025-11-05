import React, { useEffect, useState } from 'react';
import type { Category } from '../types';
import ItemMenu from './ItemMenu';

interface CategoriesPageProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  canModify: (item: any) => boolean;
  onReorderCategories?: (orderedIds: number[]) => void;
}

const CategoryCard: React.FC<{
  category: Category;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canModify: boolean;
}> = ({ category, onClick, onEdit, onDelete, canModify }) => {
  const totalSubjects = Array.isArray(category._theme_of_category_2)
    ? category._theme_of_category_2.length
    : typeof category.theme_count === 'number'
    ? category.theme_count
    : 0;

  return (
    <div className="group relative bg-white p-6 rounded-2xl border-2 border-transparent hover:border-yellow-400 shadow-md hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-2">
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-500 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">{category.name}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {totalSubjects} sujet{totalSubjects > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      {canModify && <ItemMenu onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
};

const moveCategory = (items: Category[], sourceId: number, targetId: number): Category[] => {
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

const hasSameOrder = (current: Category[], next: Category[]): boolean => {
  if (current.length !== next.length) return false;
  return current.every((item, index) => item.id === next[index]?.id);
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  canModify,
  onReorderCategories,
}) => {
  const [orderedCategories, setOrderedCategories] = useState<Category[]>(categories);
  const [draggedCategoryId, setDraggedCategoryId] = useState<number | null>(null);
  const canAdmin = canModify({});
  const allowReorder = Boolean(onReorderCategories) && canAdmin;

  useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, categoryId: number) => {
    if (!allowReorder) return;
    setDraggedCategoryId(categoryId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(categoryId));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!allowReorder) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetId: number) => {
    if (!allowReorder || draggedCategoryId === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (draggedCategoryId === targetId) {
      setDraggedCategoryId(null);
      return;
    }

    const updated = moveCategory(orderedCategories, draggedCategoryId, targetId);
    setDraggedCategoryId(null);
    if (hasSameOrder(orderedCategories, updated)) {
      return;
    }

    setOrderedCategories(updated);
    onReorderCategories?.(updated.map((category) => category.id));
  };

  const handleDragEnd = () => {
    setDraggedCategoryId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800">Nos Catégories</h2>
          <p className="mt-2 text-lg text-gray-500">Choisissez une catégorie à explorer.</p>
        </div>
        {canAdmin && (
          <button
            onClick={onAddCategory}
            className="hidden md:inline-flex items-center space-x-2 px-6 py-3 bg-yellow-100 text-yellow-800 font-semibold rounded-full shadow-sm hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105 mt-6 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Créer une catégorie</span>
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {orderedCategories.map((category) => {
          const isDragging = draggedCategoryId === category.id;
          const draggableProps = allowReorder
            ? {
                draggable: true,
                onDragStart: (event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, category.id),
                onDragOver: handleDragOver,
                onDrop: (event: React.DragEvent<HTMLDivElement>) => handleDrop(event, category.id),
                onDragEnd: handleDragEnd,
              }
            : {};

          return (
            <div
              key={category.id}
              {...draggableProps}
              className={`relative ${allowReorder ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-70' : ''}`}
            >
              {allowReorder && (
                <div className="pointer-events-none select-none absolute left-4 top-4 text-gray-300 text-lg">::</div>
              )}
              <CategoryCard
                category={category}
                onClick={() => onSelectCategory(category.id)}
                onEdit={() => onEditCategory(category)}
                onDelete={() => onDeleteCategory(category)}
                canModify={canModify(category)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
