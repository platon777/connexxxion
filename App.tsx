import React, { useState } from 'react';
import { MOCK_DATA } from './constants';
import type { Category, Subject, Confession, Comment, View, ModalState } from './types';

import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoriesPage from './components/CategoriesPage';
import SubjectsPage from './components/SubjectsPage';
import ConfessionsPage from './components/ConfessionsPage';
import ConfessionDetailPage from './components/ConfessionDetailPage';
import LoginPage from './components/LoginPage';
import MobileNav from './components/MobileNav';
import AddCategoryForm from './components/AddCategoryForm';
import AddSubjectForm from './components/AddSubjectForm';
import AddConfessionForm from './components/AddConfessionForm';
import AddCommentForm from './components/AddCommentForm';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Category[]>(MOCK_DATA);
  const [view, setView] = useState<View>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedConfessionId, setSelectedConfessionId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  // --- Data Access Helpers ---
  const findCategory = (id: string | null) => data.find(c => c.id === id);
  const findSubject = (cat: Category | undefined, id: string | null) => cat?.subjects.find(s => s.id === id);
  const findConfession = (sub: Subject | undefined, id: string | null) => sub?.confessions.find(c => c.id === id);

  const selectedCategory = findCategory(selectedCategoryId);
  const selectedSubject = findSubject(selectedCategory, selectedSubjectId);
  const selectedConfession = findConfession(selectedSubject, selectedConfessionId);

  // --- Auth ---
  const handleLogin = (id: string) => {
    setUserId(id);
    setView('home');
  };
  const handleLogout = () => {
    setUserId(null);
    setView('home');
    setSelectedCategoryId(null);
    setSelectedSubjectId(null);
    setSelectedConfessionId(null);
  };
  const canModify = (item: { userId: string }) => {
    if (!userId) return false;
    return userId === 'admin' || userId === item.userId;
  };

  // --- Navigation ---
  const navigate = (newView: View, catId: string | null = null, subId: string | null = null, confId: string | null = null) => {
    setView(newView);
    setSelectedCategoryId(catId);
    setSelectedSubjectId(subId);
    setSelectedConfessionId(confId);
  };

  const handleBack = () => {
    if (view === 'confessionDetail') {
      navigate('confessions', selectedCategoryId, selectedSubjectId);
    } else if (view === 'confessions') {
      navigate('subjects', selectedCategoryId);
    } else if (view === 'subjects') {
      navigate('categories');
    }
  };

  // --- CRUD Operations ---
  const closeModal = () => setModalState(null);

  // Category
  const handleAddCategory = (name: string) => {
    if(!userId) return;
    const newCategory: Category = { id: `cat${Date.now()}`, name, userId: userId, subjects: [] };
    setData([...data, newCategory]);
    closeModal();
  };
  const handleEditCategory = (name: string) => {
    if (modalState?.type === 'editCategory') {
      setData(data.map(c => c.id === modalState.category.id ? { ...c, name } : c));
    }
    closeModal();
  };
  const handleDeleteCategory = (category: Category) => {
    setData(data.filter(c => c.id !== category.id));
    closeModal();
  };

  // Subject
  const handleAddSubject = (title: string) => {
    if(!userId || !selectedCategoryId) return;
    const newSubject: Subject = { id: `sub${Date.now()}`, categoryId: selectedCategoryId, title, userId: userId, confessions: [] };
    setData(data.map(c => c.id === selectedCategoryId ? { ...c, subjects: [...c.subjects, newSubject] } : c));
    closeModal();
  };
  const handleEditSubject = (title: string) => {
    if (modalState?.type === 'editSubject' && selectedCategory) {
      const updatedSubjects = selectedCategory.subjects.map(s => s.id === modalState.subject.id ? { ...s, title } : s);
      setData(data.map(c => c.id === selectedCategoryId ? { ...c, subjects: updatedSubjects } : c));
    }
    closeModal();
  };
  const handleDeleteSubject = (subject: Subject) => {
    if (selectedCategory) {
      const updatedSubjects = selectedCategory.subjects.filter(s => s.id !== subject.id);
      setData(data.map(c => c.id === selectedCategoryId ? { ...c, subjects: updatedSubjects } : c));
    }
    closeModal();
  };
  
  // Confession
  const handleAddConfession = (content: string) => {
      if(!userId || !selectedSubjectId) return;
      const newConfession: Confession = {
          id: `conf${Date.now()}`,
          subjectId: selectedSubjectId,
          author: 'Anonyme',
          userId: userId,
          timestamp: 'à l\'instant',
          content,
          peach_likes: 0,
          grape_likes: 0,
          comments: [],
      };
      if (selectedCategory && selectedSubject) {
          const updatedConfessions = [...selectedSubject.confessions, newConfession];
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };
  const handleEditConfession = (content: string) => {
      if (modalState?.type === 'editConfession' && selectedCategory && selectedSubject) {
          const updatedConfessions = selectedSubject.confessions.map(conf => conf.id === modalState.confession.id ? {...conf, content} : conf);
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };
  const handleDeleteConfession = (confession: Confession) => {
      if (selectedCategory && selectedSubject) {
          const updatedConfessions = selectedSubject.confessions.filter(c => c.id !== confession.id);
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };

  // Comment
  const handleAddComment = (content: string) => {
      if(!userId || !selectedConfessionId) return;
      const newComment: Comment = {
          id: `com${Date.now()}`,
          confessionId: selectedConfessionId,
          author: userId,
          userId: userId,
          timestamp: 'à l\'instant',
          content,
          likes: 0
      };
      if (selectedCategory && selectedSubject && selectedConfession) {
          const updatedComments = [...selectedConfession.comments, newComment];
          const updatedConfessions = selectedSubject.confessions.map(c => c.id === selectedConfessionId ? {...c, comments: updatedComments} : c);
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };
  const handleEditComment = (content: string) => {
      if (modalState?.type === 'editComment' && selectedCategory && selectedSubject && selectedConfession) {
          const updatedComments = selectedConfession.comments.map(com => com.id === modalState.comment.id ? {...com, content} : com);
          const updatedConfessions = selectedSubject.confessions.map(c => c.id === selectedConfessionId ? {...c, comments: updatedComments} : c);
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };
  const handleDeleteComment = (comment: Comment) => {
      if (selectedCategory && selectedSubject && selectedConfession) {
          const updatedComments = selectedConfession.comments.filter(c => c.id !== comment.id);
          const updatedConfessions = selectedSubject.confessions.map(c => c.id === selectedConfessionId ? {...c, comments: updatedComments} : c);
          const updatedSubjects = selectedCategory.subjects.map(s => s.id === selectedSubjectId ? {...s, confessions: updatedConfessions} : s);
          setData(data.map(c => c.id === selectedCategoryId ? {...c, subjects: updatedSubjects} : c));
      }
      closeModal();
  };

  const handleMobileAdd = () => {
    switch(view) {
        case 'categories': setModalState({ type: 'addCategory' }); break;
        case 'subjects': setModalState({ type: 'addSubject' }); break;
        case 'confessions': setModalState({ type: 'addConfession' }); break;
        case 'confessionDetail': setModalState({ type: 'addComment' }); break;
        default: break;
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    switch(view) {
      case 'home':
        return <HomePage onStart={() => navigate('categories')} />;
      case 'categories':
        return <CategoriesPage
          categories={data}
          onSelectCategory={(id) => navigate('subjects', id)}
          onAddCategory={() => setModalState({ type: 'addCategory' })}
          onEditCategory={(c) => setModalState({ type: 'editCategory', category: c })}
          onDeleteCategory={(c) => setModalState({ type: 'confirmDelete', message: 'Supprimer cette catégorie et tous ses sujets ?', onConfirm: () => handleDeleteCategory(c) })}
          canModify={canModify}
        />;
      case 'subjects':
        if (!selectedCategory) return <div>Catégorie non trouvée</div>;
        return <SubjectsPage
          category={selectedCategory}
          onSelectSubject={(id) => navigate('confessions', selectedCategoryId, id)}
          onBack={handleBack}
          onAddSubject={() => setModalState({ type: 'addSubject' })}
          onEditSubject={(s) => setModalState({ type: 'editSubject', subject: s })}
          onDeleteSubject={(s) => setModalState({ type: 'confirmDelete', message: 'Supprimer ce sujet et toutes ses confessions ?', onConfirm: () => handleDeleteSubject(s) })}
          canModify={canModify}
        />;
      case 'confessions':
        if (!selectedSubject) return <div>Sujet non trouvé</div>;
        return <ConfessionsPage
          subject={selectedSubject}
          onSelectConfession={(id) => navigate('confessionDetail', selectedCategoryId, selectedSubjectId, id)}
          onBack={handleBack}
          onAddConfession={() => setModalState({ type: 'addConfession' })}
          onEditConfession={(c) => setModalState({ type: 'editConfession', confession: c })}
          onDeleteConfession={(c) => setModalState({ type: 'confirmDelete', message: 'Supprimer cette confession ?', onConfirm: () => handleDeleteConfession(c) })}
          canModify={canModify}
        />;
      case 'confessionDetail':
        if (!selectedConfession) return <div>Confession non trouvée</div>;
        return <ConfessionDetailPage
          confession={selectedConfession}
          onBack={handleBack}
          onAddComment={() => setModalState({ type: 'addComment' })}
          onEditComment={(c) => setModalState({ type: 'editComment', comment: c })}
          onDeleteComment={(c) => setModalState({ type: 'confirmDelete', message: 'Supprimer ce commentaire ?', onConfirm: () => handleDeleteComment(c) })}
          canModify={canModify}
        />;
      default:
        return <HomePage onStart={() => navigate('categories')} />;
    }
  };

  const renderModal = () => {
    if (!modalState) return null;

    switch (modalState.type) {
      case 'addCategory':
        return <AddCategoryForm onClose={closeModal} onSubmit={handleAddCategory} />;
      case 'editCategory':
        return <AddCategoryForm onClose={closeModal} onSubmit={handleEditCategory} itemToEdit={modalState.category} />;
      case 'addSubject':
        return <AddSubjectForm onClose={closeModal} onSubmit={handleAddSubject} />;
      case 'editSubject':
        return <AddSubjectForm onClose={closeModal} onSubmit={handleEditSubject} itemToEdit={modalState.subject} />;
      case 'addConfession':
          return <AddConfessionForm onClose={closeModal} onSubmit={handleAddConfession} />;
      case 'editConfession':
          return <AddConfessionForm onClose={closeModal} onSubmit={handleEditConfession} itemToEdit={modalState.confession} />;
      case 'addComment':
          return <AddCommentForm onClose={closeModal} onSubmit={handleAddComment} />;
      case 'editComment':
          return <AddCommentForm onClose={closeModal} onSubmit={handleEditComment} itemToEdit={modalState.comment} />;
      case 'confirmDelete':
        return <ConfirmDeleteModal message={modalState.message} onConfirm={modalState.onConfirm} onCancel={closeModal} />;
      default:
        return null;
    }
  };
  
  if (!userId) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <Header 
        onHomeClick={() => navigate('home')} 
        onCategoriesClick={() => navigate('categories')}
        userId={userId}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderContent()}
      </main>
      <MobileNav 
        currentView={view}
        onHomeClick={() => navigate('home')}
        onCategoriesClick={() => navigate('categories')}
        onAddClick={handleMobileAdd}
      />
      {renderModal()}
      <div className="pb-20 md:pb-0"></div> {/* Spacer for mobile nav */}
    </div>
  );
};

export default App;
