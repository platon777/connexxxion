import React, { useState, useEffect } from 'react';
import type { Category, Theme, Confession, Comment, View, ModalState, User } from './types';
import {
  categoryService,
  themeService,
  confessionService,
  commentService,
  authService,
} from './api';

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
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedConfessionId, setSelectedConfessionId] = useState<number | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [confessionComments, setConfessionComments] = useState<Record<number, Comment[]>>({});

  // --- Load initial data ---
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfessionComments = async (confessionId: number) => {
    try {
      const data = await commentService.getCommentsByConfession(confessionId);
      setConfessionComments((prev) => ({
        ...prev,
        [confessionId]: data,
      }));
    } catch (error) {
      console.error(`Failed to load comments for confession ${confessionId}:`, error);
    }
  };

  // --- Data Access Helpers ---
  const findCategory = (id: number | null): Category | undefined => {
    return id !== null ? categories.find((c: Category) => c.id === id) : undefined;
  };

  const findTheme = (cat: Category | undefined, id: number | null): Theme | undefined => {
    if (!cat || id === null) return undefined;
    return cat._theme_of_category_2?.find((t: Theme) => t.id === id);
  };

  const findConfession = (theme: Theme | undefined, id: number | null): Confession | undefined => {
    if (!theme || id === null) return undefined;
    return theme._confession?.find((c: Confession) => c.id === id);
  };

  const selectedCategory = findCategory(selectedCategoryId);
  const selectedTheme = findTheme(selectedCategory, selectedThemeId);
  const baseConfession = findConfession(selectedTheme, selectedConfessionId);
  const selectedConfession = baseConfession
    ? {
        ...baseConfession,
        _comment_of_confession:
          confessionComments[baseConfession.id] ?? baseConfession._comment_of_confession ?? [],
      }
    : undefined;

  // --- Auth ---
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('home');
    loadCategories(); // Reload data after login
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('home');
    setSelectedCategoryId(null);
    setSelectedThemeId(null);
    setSelectedConfessionId(null);
  };

  const openLoginView = () => {
    setModalState(null);
    setView('login');
  };

  const canModify = (item?: { user?: number | null }) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!item || item.user == null) return true;
    return user.id === item.user;
  };

  // --- Navigation ---
  const navigate = (
    newView: View,
    catId: number | null = null,
    themeId: number | null = null,
    confId: number | null = null
  ) => {
    setView(newView);
    setSelectedCategoryId(catId);
    setSelectedThemeId(themeId);
    setSelectedConfessionId(confId);

    if (newView === 'confessionDetail' && confId !== null) {
      loadConfessionComments(confId);
    }
  };

  const handleBack = () => {
    if (view === 'confessionDetail') {
      navigate('confessions', selectedCategoryId, selectedThemeId);
    } else if (view === 'confessions') {
      navigate('subjects', selectedCategoryId);
    } else if (view === 'subjects') {
      navigate('categories');
    }
  };

  // --- CRUD Operations ---
  const closeModal = () => setModalState(null);

  // Category
  const handleAddCategory = async (name: string) => {
    if (!user) return;
    try {
      await categoryService.createCategory({ name });
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Erreur lors de la création de la catégorie');
    }
  };

  const handleEditCategory = async (name: string) => {
    if (modalState?.type === 'editCategory') {
      try {
        await categoryService.updateCategory(modalState.category.id, { name });
        await loadCategories();
        closeModal();
      } catch (error) {
        console.error('Failed to update category:', error);
        alert('Erreur lors de la modification de la catégorie');
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await categoryService.deleteCategory(category.id);
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  // Theme (Subject)
  const handleAddTheme = async (title: string) => {
    if (!user || !selectedCategoryId) return;
    try {
      await themeService.createTheme({
        name: title,
        category: selectedCategoryId,
      });
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to create theme:', error);
      alert('Erreur lors de la création du sujet');
    }
  };

  const handleEditTheme = async (title: string) => {
    if (modalState?.type === 'editTheme') {
      try {
        await themeService.updateTheme(modalState.theme.id, { name: title });
        await loadCategories();
        closeModal();
      } catch (error) {
        console.error('Failed to update theme:', error);
        alert('Erreur lors de la modification du sujet');
      }
    }
  };

  const handleDeleteTheme = async (theme: Theme) => {
    try {
      await themeService.deleteTheme(theme.id);
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to delete theme:', error);
      alert('Erreur lors de la suppression du sujet');
    }
  };

  // Confession
  const handleAddConfession = async (content: string) => {
    if (!user || !selectedThemeId) return;
    try {
      await confessionService.createConfession({
        user: user.id,
        theme: selectedThemeId,
        title: content.substring(0, 50), // Use first 50 chars as title
        content,
      });
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to create confession:', error);
      alert('Erreur lors de la création de la confession');
    }
  };

  const handleEditConfession = async (content: string) => {
    if (modalState?.type === 'editConfession') {
      try {
        await confessionService.updateConfession(modalState.confession.id, {
          content,
          title: content.substring(0, 50),
        });
        await loadCategories();
        closeModal();
      } catch (error) {
        console.error('Failed to update confession:', error);
        alert('Erreur lors de la modification de la confession');
      }
    }
  };

  const handleDeleteConfession = async (confession: Confession) => {
    try {
      await confessionService.deleteConfession(confession.id);
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to delete confession:', error);
      alert('Erreur lors de la suppression de la confession');
    }
  };

  // Comment
  const handleAddComment = async (content: string) => {
    if (!user || !selectedConfessionId) return;
    try {
      await commentService.createComment({
        user: user.id,
        confession: selectedConfessionId,
        content,
      });
      await loadCategories();
      await loadConfessionComments(selectedConfessionId);
      closeModal();
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Erreur lors de la création du commentaire');
    }
  };

  const handleEditComment = async (content: string) => {
    if (modalState?.type === 'editComment') {
      try {
        await commentService.updateComment(modalState.comment.id, { content });
        await loadCategories();
        if (selectedConfessionId) {
          await loadConfessionComments(selectedConfessionId);
        }
        closeModal();
      } catch (error) {
        console.error('Failed to update comment:', error);
        alert('Erreur lors de la modification du commentaire');
      }
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await commentService.deleteComment(comment.id);
      await loadCategories();
      if (selectedConfessionId) {
        await loadConfessionComments(selectedConfessionId);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Erreur lors de la suppression du commentaire');
    }
  };

  const handleMobileAdd = () => {
    if (!user) {
      openLoginView();
      return;
    }

    switch (view) {
      case 'categories':
        setModalState({ type: 'addCategory' });
        break;
      case 'subjects':
        setModalState({ type: 'addTheme' });
        break;
      case 'confessions':
        setModalState({ type: 'addConfession' });
        break;
      case 'confessionDetail':
        setModalState({ type: 'addComment' });
        break;
      default:
        break;
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (loading && view !== 'login') {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home':
        return <HomePage onStart={() => navigate('categories')} />;
      case 'categories':
        return (
          <CategoriesPage
            categories={categories}
            onSelectCategory={(id: number) => navigate('subjects', id)}
            onAddCategory={() => (user ? setModalState({ type: 'addCategory' }) : openLoginView())}
            onEditCategory={(c: Category) => setModalState({ type: 'editCategory', category: c })}
            onDeleteCategory={(c: Category) =>
              setModalState({
                type: 'confirmDelete',
                message: 'Supprimer cette catégorie et tous ses sujets ?',
                onConfirm: () => handleDeleteCategory(c),
              })
            }
            canModify={canModify}
          />
        );
      case 'subjects':
        if (!selectedCategory) return <div>Catégorie non trouvée</div>;
        return (
          <SubjectsPage
            category={selectedCategory}
            onSelectSubject={(id: number) => navigate('confessions', selectedCategoryId, id)}
            onBack={handleBack}
            onAddSubject={() => (user ? setModalState({ type: 'addTheme' }) : openLoginView())}
            onEditSubject={(s: Theme) => setModalState({ type: 'editTheme', theme: s })}
            onDeleteSubject={(s: Theme) =>
              setModalState({
                type: 'confirmDelete',
                message: 'Supprimer ce sujet et toutes ses confessions ?',
                onConfirm: () => handleDeleteTheme(s),
              })
            }
            canModify={canModify}
          />
        );
      case 'confessions':
        if (!selectedTheme) return <div>Sujet non trouvé</div>;
        return (
          <ConfessionsPage
            subject={selectedTheme}
            onSelectConfession={(id: number) => navigate('confessionDetail', selectedCategoryId, selectedThemeId, id)}
            onBack={handleBack}
            onAddConfession={() => (user ? setModalState({ type: 'addConfession' }) : openLoginView())}
            onEditConfession={(c: Confession) => setModalState({ type: 'editConfession', confession: c })}
            onDeleteConfession={(c: Confession) =>
              setModalState({
                type: 'confirmDelete',
                message: 'Supprimer cette confession ?',
                onConfirm: () => handleDeleteConfession(c),
              })
            }
            canModify={canModify}
          />
        );
      case 'confessionDetail':
        if (!selectedConfession) return <div>Confession non trouvée</div>;
        return (
          <ConfessionDetailPage
            confession={selectedConfession}
            onBack={handleBack}
            onAddComment={() => (user ? setModalState({ type: 'addComment' }) : openLoginView())}
            onEditComment={(c: Comment) => setModalState({ type: 'editComment', comment: c })}
            onDeleteComment={(c: Comment) =>
              setModalState({
                type: 'confirmDelete',
                message: 'Supprimer ce commentaire ?',
                onConfirm: () => handleDeleteComment(c),
              })
            }
            canModify={canModify}
          />
        );
      case 'login':
        return <LoginPage onLogin={handleLoginSuccess} />;
      default:
        return <HomePage onStart={() => navigate('categories')} />;
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    handleLogin(loggedInUser);
    closeModal();
  };

  const renderModal = () => {
    if (!modalState) return null;

    switch (modalState.type) {
      case 'addCategory':
        return <AddCategoryForm onClose={closeModal} onSubmit={handleAddCategory} />;
      case 'editCategory':
        return (
          <AddCategoryForm onClose={closeModal} onSubmit={handleEditCategory} itemToEdit={modalState.category} />
        );
      case 'addTheme':
        return <AddSubjectForm onClose={closeModal} onSubmit={handleAddTheme} />;
      case 'editTheme':
        return <AddSubjectForm onClose={closeModal} onSubmit={handleEditTheme} itemToEdit={modalState.theme} />;
      case 'addConfession':
        return <AddConfessionForm onClose={closeModal} onSubmit={handleAddConfession} />;
      case 'editConfession':
        return (
          <AddConfessionForm
            onClose={closeModal}
            onSubmit={handleEditConfession}
            itemToEdit={modalState.confession}
          />
        );
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

  const isLoginView = view === 'login';
  const mainClassName = isLoginView
    ? 'px-0 py-0'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12';

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <Header
        onHomeClick={() => navigate('home')}
        onCategoriesClick={() => navigate('categories')}
        userId={user?.name || null}
        onLogout={handleLogout}
        onLogin={openLoginView}
      />
      <main className={mainClassName}>{renderContent()}</main>
      {!isLoginView && (
        <MobileNav
          currentView={view}
          onHomeClick={() => navigate('home')}
          onCategoriesClick={() => navigate('categories')}
          onAddClick={handleMobileAdd}
        />
      )}
      {!isLoginView && renderModal()}
      {!isLoginView && <div className="pb-20 md:pb-0"></div>}
    </div>
  );
};

export default App;
