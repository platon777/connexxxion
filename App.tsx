import React, { useState, useEffect, useRef } from 'react';
import type { Category, Theme, Confession, Comment, View, ModalState, User } from './types';
import {
  categoryService,
  themeService,
  confessionService,
  commentService,
  authService,
  likeService,
  memoService,
  getDeviceId,
  subscribeToRealtimeChannel,
} from './api';

import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoriesPage from './components/CategoriesPage';
import SubjectsPage from './components/SubjectsPage';
import ConfessionsPage from './components/ConfessionsPage';
import ConfessionDetailPage from './components/ConfessionDetailPage';
import LoginPage from './components/LoginPage';
import DonationsPage from './components/DonationsPage';
import MemosPage from './components/MemosPage';
import DonationButton from './components/DonationButton';
import MobileNav from './components/MobileNav';
import AddCategoryForm from './components/AddCategoryForm';
import AddSubjectForm from './components/AddSubjectForm';
import AddConfessionForm from './components/AddConfessionForm';
import AddCommentForm from './components/AddCommentForm';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

type NavigationState = {
  view: View;
  categoryId: number | null;
  themeId: number | null;
  confessionId: number | null;
};

const parseNumberParam = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildUrlFromState = (state: NavigationState): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  const url = new URL(window.location.href);
  const params = new URLSearchParams();

  switch (state.view) {
    case 'home':
      break;
    case 'categories':
      params.set('view', 'categories');
      break;
    case 'subjects':
      params.set('view', 'subjects');
      if (state.categoryId) {
        params.set('categoryId', String(state.categoryId));
      }
      break;
    case 'confessions':
      params.set('view', 'confessions');
      if (state.categoryId) {
        params.set('categoryId', String(state.categoryId));
      }
      if (state.themeId) {
        params.set('themeId', String(state.themeId));
      }
      break;
    case 'confessionDetail':
      params.set('view', 'confessionDetail');
      if (state.categoryId) {
        params.set('categoryId', String(state.categoryId));
      }
      if (state.themeId) {
        params.set('themeId', String(state.themeId));
      }
      if (state.confessionId) {
        params.set('confessionId', String(state.confessionId));
      }
      break;
    default:
      params.set('view', state.view);
      break;
  }

  const search = params.toString();
  return `${url.pathname}${search ? `?${search}` : ''}`;
};

const findConfessionLocationInCategories = (
  categories: Category[],
  confessionId: number
): { categoryId: number; themeId: number } | null => {
  for (const category of categories) {
    if (!Array.isArray(category._theme_of_category_2)) continue;
    for (const theme of category._theme_of_category_2) {
      if (!Array.isArray(theme._confession)) continue;
      if (theme._confession.some((confession) => confession.id === confessionId)) {
        return { categoryId: category.id, themeId: theme.id };
      }
    }
  }
  return null;
};

const reorderByIdList = <T extends { id: number }>(items: T[], orderedIds: number[]): T[] => {
  const idToItem = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  orderedIds.forEach((id) => {
    const item = idToItem.get(id);
    if (item) {
      ordered.push(item);
      idToItem.delete(id);
    }
  });
  if (idToItem.size === 0) {
    return ordered;
  }
  return [...ordered, ...Array.from(idToItem.values())];
};

const hasSameOrder = (items: { id: number }[], orderedIds: number[]): boolean => {
  if (items.length !== orderedIds.length) {
    return false;
  }
  return items.every((item, index) => item.id === orderedIds[index]);
};

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
  const selectedConfessionIdRef = useRef<number | null>(null);
  const [previousView, setPreviousView] = useState<View | null>(null);

  // --- Load initial data ---
  useEffect(() => {
    void (async () => {
      try {
        await getDeviceId();
      } catch (error) {
        console.warn('Unable to prefetch device id:', error);
      }
    })();

    // Restore user session if authenticated
    void (async () => {
      if (authService.isAuthenticated()) {
        try {
          const restoredUser = await authService.getCurrentUser();
          setUser(restoredUser);
        } catch (error) {
          console.error('Failed to restore user session:', error);
          // Clear invalid token
          authService.logout();
        }
      }
    })();

    loadCategories();
  }, []);

  useEffect(() => {
    selectedConfessionIdRef.current = selectedConfessionId;
  }, [selectedConfessionId]);

  // --- Browser history integration ---
  useEffect(() => {
    // Push initial state
    const initialState = {
      view,
      categoryId: selectedCategoryId,
      themeId: selectedThemeId,
      confessionId: selectedConfessionId,
    };
    window.history.replaceState(initialState, '', window.location.href);

    // Listen for browser back/forward button
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        setView(state.view || 'home');
        setSelectedCategoryId(state.categoryId || null);
        setSelectedThemeId(state.themeId || null);
        setSelectedConfessionId(state.confessionId || null);

        // Load data if navigating to confession detail
        if (state.view === 'confessionDetail' && state.confessionId) {
          loadConfessionDetail(state.confessionId);
          loadConfessionComments(state.confessionId);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Push state to history when view changes
  useEffect(() => {
    const state = {
      view,
      categoryId: selectedCategoryId,
      themeId: selectedThemeId,
      confessionId: selectedConfessionId,
    };

    // Only push if state has actually changed from current history state
    const currentState = window.history.state;
    if (
      !currentState ||
      currentState.view !== state.view ||
      currentState.categoryId !== state.categoryId ||
      currentState.themeId !== state.themeId ||
      currentState.confessionId !== state.confessionId
    ) {
      const url = buildUrlFromState(state);
      window.history.pushState(state, '', url);
    }
  }, [view, selectedCategoryId, selectedThemeId, selectedConfessionId]);

  useEffect(() => {
    const unsubscribeConfessions = subscribeToRealtimeChannel('confessions', async () => {
      await loadCategories({ silent: true });
    });

    const unsubscribeComments = subscribeToRealtimeChannel('comment', async (payload) => {
      const data = payload as Record<string, unknown> | null;
      const confessionIdRaw = data?.confession ?? (data as any)?.confession_id;
      const confessionId =
        typeof confessionIdRaw === 'number'
          ? confessionIdRaw
          : typeof confessionIdRaw === 'string'
          ? parseInt(confessionIdRaw, 10)
          : null;

      if (confessionId) {
        await loadConfessionDetail(confessionId);
        await loadConfessionComments(confessionId);
      } else {
        const fallbackId = selectedConfessionIdRef.current;
        if (fallbackId) {
          await loadConfessionDetail(fallbackId);
          await loadConfessionComments(fallbackId);
        } else {
          await loadCategories({ silent: true });
        }
      }
    });

    return () => {
      unsubscribeConfessions();
      unsubscribeComments();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    if (!silent) {
      setLoading(true);
    }
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
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

  const loadConfessionDetail = async (confessionId: number) => {
    try {
      const response = (await confessionService.getConfession(confessionId)) as any;
      const detail: Confession = response?.result1 ?? response;
      const likeCount = response?.number_of_like ?? detail?.like_count ?? 0;
      const commentCount = response?.number_of_comments ?? detail?.comment_count ?? 0;
      const isLikedRaw = response?.is_liked ?? detail?._is_liked ?? detail?.is_liked;
      const isLiked = isLikedRaw === true || isLikedRaw === 1;
      const userObject =
        detail?._user_object ??
        (detail as any)?._user_10 ??
        (detail as any)?._user ??
        undefined;

      updateConfessionInState(confessionId, (current) => ({
        ...current,
        ...detail,
        like_count: likeCount,
        real_like_count: likeCount,
        comment_count: commentCount,
        _is_liked: isLiked,
        view_count: detail?.view_count ?? current.view_count,
        _user_object:
          userObject != null
            ? {
                ...userObject,
                sex:
                  (userObject as any).sex ??
                  (userObject as any).sexe ??
                  (userObject as any).Sex ??
                  (userObject as any).gender ??
                  current._user_object?.sex,
              }
            : current._user_object,
      }));
    } catch (error) {
      console.error(`Failed to load confession detail ${confessionId}:`, error);
    }
  };

  const updateConfessionInState = (confessionId: number, updater: (confession: Confession) => Confession) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (!Array.isArray(category._theme_of_category_2)) {
          return category;
        }

        let categoryChanged = false;
        const updatedThemes = category._theme_of_category_2.map((theme) => {
          if (!Array.isArray(theme._confession)) {
            return theme;
          }

          let themeChanged = false;
          const updatedConfessions = theme._confession.map((confession) => {
            if (confession.id !== confessionId) {
              return confession;
            }
            themeChanged = true;
            categoryChanged = true;
            return updater(confession);
          });

          return themeChanged ? { ...theme, _confession: updatedConfessions } : theme;
        });

        return categoryChanged ? { ...category, _theme_of_category_2: updatedThemes } : category;
      })
    );
  };

  const updateCommentInState = (
    confessionId: number,
    commentId: number,
    updater: (comment: Comment) => Comment
  ) => {
    updateConfessionInState(confessionId, (confession) => {
      if (!Array.isArray(confession._comment_of_confession)) {
        return confession;
      }

      const updatedComments = confession._comment_of_confession.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }
        return updater(comment);
      });

      return {
        ...confession,
        _comment_of_confession: updatedComments,
      };
    });

    setConfessionComments((prev) => {
      const current = prev[confessionId];
      if (!current) {
        return prev;
      }

      const updated = current.map((comment) => (comment.id === commentId ? updater(comment) : comment));
      return { ...prev, [confessionId]: updated };
    });
  };

  const resolveConfessionLocation = async (
    confessionId: number,
    hints: { categoryId?: number | null; themeId?: number | null } = {}
  ): Promise<{ categoryId: number; themeId: number } | null> => {
    if (hints.categoryId && hints.themeId) {
      return {
        categoryId: hints.categoryId,
        themeId: hints.themeId,
      };
    }

    const fromState = findConfessionLocationInCategories(categories, confessionId);
    if (fromState) {
      return fromState;
    }

    try {
      const response = (await confessionService.getConfession(confessionId)) as any;
      const detail: Confession = response?.result1 ?? response;
      const themeId =
        detail?.theme ??
        (detail as any)?.theme_id ??
        detail?._theme?.id ??
        (detail as any)?._theme?.theme_id ??
        hints.themeId ??
        null;
      const categoryId =
        detail?._theme?.category ??
        detail?._theme?.category_id ??
        (detail as any)?.category ??
        (detail as any)?.category_id ??
        hints.categoryId ??
        null;

      if (themeId && categoryId) {
        if (!findConfessionLocationInCategories(categories, confessionId)) {
          await loadCategories({ silent: true });
        }
        return { categoryId, themeId };
      }
    } catch (error) {
      console.error(`Failed to resolve location for confession ${confessionId}:`, error);
    }

    return null;
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

  const isCurrentThemeActive = (() => {
    if (selectedTheme && selectedTheme.Active !== undefined) {
      return Boolean(selectedTheme.Active);
    }
    if (selectedConfession?._theme && selectedConfession._theme.Active !== undefined) {
      return Boolean(selectedConfession._theme.Active);
    }
    return true;
  })();

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

  const promptLoginForFullExperience = () => {
    alert('Pour profiter pleinement de ConnexXxion, merci de vous connecter pour continuer.');
    openLoginView();
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isAuthenticated = Boolean(user);
  const showMobileAddButton = (() => {
    // Pages où le bouton + ne doit JAMAIS apparaître
    if (view === 'home' || view === 'donations' || view === 'memos' || view === 'login') {
      return false;
    }

    // Pour les admins sur categories et subjects
    if (isAdmin && (view === 'categories' || view === 'subjects')) {
      return true;
    }

    // Pour tous les utilisateurs connectés sur confessions
    if (isAuthenticated && (view === 'confessions' || view === 'confessionDetail')) {
      if (!isCurrentThemeActive) {
        return false;
      }
      return true;
    }

    return false;
  })();

  const requireAdmin = () => {
    if (!user) {
      openLoginView();
      return false;
    }
    if (!isAdmin) {
      alert('Cette action est reservee aux administrateurs.');
      return false;
    }
    return true;
  };

  const canManageCategory = () => Boolean(isAdmin);
  const canManageTheme = () => Boolean(isAdmin);
  const canManageConfession = (item?: { user?: number | null }) => {
    if (!user) return false;
    if (isAdmin) return true;
    return item?.user === user.id;
  };
  const canManageComment = (item?: { user?: number | null }) => {
    if (!user) return false;
    if (isAdmin) return true;
    return item?.user === user.id;
  };

  const canModifyConfessionForUI = (item?: { user?: number | null }) => {
    if (!item || item.user == null) {
      return Boolean(user);
    }
    return canManageConfession(item);
  };

  const ensureLoggedIn = () => {
    if (!user) {
      openLoginView();
      return false;
    }
    return true;
  };

  const openAddCategoryModal = () => {
    if (!ensureLoggedIn()) return;
    if (!canManageCategory()) {
      alert('Seul un administrateur peut ajouter une categorie.');
      return;
    }
    setModalState({ type: 'addCategory' });
  };

  const openAddThemeModal = () => {
    if (!ensureLoggedIn()) return;
    if (!canManageTheme()) {
      alert('Seul un administrateur peut ajouter un sujet.');
      return;
    }
    setModalState({ type: 'addTheme' });
  };

  const openAddConfessionModal = () => {
    if (!ensureLoggedIn()) return;
    const themeInactive =
      (selectedTheme && selectedTheme.Active === false) ||
      (!selectedTheme && selectedConfession?._theme?.Active === false);
    if (themeInactive) {
      alert('Ce sujet est ferme aux confessions pour le moment.');
      return;
    }
    setModalState({ type: 'addConfession' });
  };

  const openAddCommentModal = () => {
    if (!ensureLoggedIn()) return;
    setModalState({ type: 'addComment' });
  };

  const openEditCategoryModal = (category: Category) => {
    if (!requireAdmin()) return;
    setModalState({ type: 'editCategory', category });
  };

  const openDeleteCategoryModal = (category: Category) => {
    if (!requireAdmin()) return;
    setModalState({
      type: 'confirmDelete',
      message: 'Supprimer cette categorie et tous ses sujets ?',
      onConfirm: () => handleDeleteCategory(category),
    });
  };

  const openEditThemeModal = (theme: Theme) => {
    if (!requireAdmin()) return;
    setModalState({ type: 'editTheme', theme });
  };

  const openDeleteThemeModal = (theme: Theme) => {
    if (!requireAdmin()) return;
    setModalState({
      type: 'confirmDelete',
      message: 'Supprimer ce sujet et toutes ses confessions ?',
      onConfirm: () => handleDeleteTheme(theme),
    });
  };

  const openEditConfessionModal = (confession: Confession) => {
    if (!canManageConfession(confession)) {
      alert('Vous ne pouvez pas modifier cette confession.');
      return;
    }
    setModalState({ type: 'editConfession', confession });
  };

  const openDeleteConfessionModal = (confession: Confession) => {
    if (!canManageConfession(confession)) {
      alert('Vous ne pouvez pas supprimer cette confession.');
      return;
    }
    setModalState({
      type: 'confirmDelete',
      message: 'Supprimer cette confession ?',
      onConfirm: () => handleDeleteConfession(confession),
    });
  };

  const openEditCommentModal = (comment: Comment) => {
    if (!canManageComment(comment)) {
      alert('Vous ne pouvez pas modifier ce commentaire.');
      return;
    }
    setModalState({ type: 'editComment', comment });
  };

  const openDeleteCommentModal = (comment: Comment) => {
    if (!canManageComment(comment)) {
      alert('Vous ne pouvez pas supprimer ce commentaire.');
      return;
    }
    setModalState({
      type: 'confirmDelete',
      message: 'Supprimer ce commentaire ?',
      onConfirm: () => handleDeleteComment(comment),
    });
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
      loadConfessionDetail(confId);
      loadConfessionComments(confId);
    }
  };

  const handleNavigateToConfessionFromUrl = async (
    confessionId: number,
    hints: { categoryId?: number | null; themeId?: number | null } = {}
  ) => {
    const location = await resolveConfessionLocation(confessionId, hints);
    if (!location) {
      alert('Confession introuvable ou plus disponible.');
      return;
    }
    navigate('confessionDetail', location.categoryId, location.themeId, confessionId);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const confessionParam = parseNumberParam(params.get('confessionId'));
    const categoryParam = parseNumberParam(params.get('categoryId'));
    const themeParam = parseNumberParam(params.get('themeId'));
    const viewParam = params.get('view') as View | null;

    if (confessionParam) {
      void handleNavigateToConfessionFromUrl(confessionParam, {
        categoryId: categoryParam,
        themeId: themeParam,
      });
      return;
    }

    if (viewParam === 'subjects' && categoryParam) {
      navigate('subjects', categoryParam);
    } else if (viewParam === 'confessions' && categoryParam && themeParam) {
      navigate('confessions', categoryParam, themeParam);
    } else if (viewParam === 'confessionDetail' && categoryParam && themeParam) {
      navigate('confessions', categoryParam, themeParam);
    } else if (viewParam === 'categories') {
      navigate('categories');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDonations = () => {
    setPreviousView(view);
    setView('donations');
  };

  const handleDonationBack = () => {
    const fallbackView: View = previousView && previousView !== 'donations' ? previousView : 'home';
    setPreviousView(null);
    if (fallbackView === 'confessionDetail') {
      if (selectedConfessionId) {
        navigate('confessionDetail', selectedCategoryId, selectedThemeId, selectedConfessionId);
        return;
      }
      if (selectedThemeId) {
        navigate('confessions', selectedCategoryId, selectedThemeId);
        return;
      }
      if (selectedCategoryId) {
        navigate('subjects', selectedCategoryId);
        return;
      }
      navigate('categories');
      return;
    }
    if (fallbackView === 'confessions') {
      if (selectedThemeId) {
        navigate('confessions', selectedCategoryId, selectedThemeId);
        return;
      }
      if (selectedCategoryId) {
        navigate('subjects', selectedCategoryId);
        return;
      }
      navigate('categories');
      return;
    }
    if (fallbackView === 'subjects') {
      if (selectedCategoryId) {
        navigate('subjects', selectedCategoryId);
        return;
      }
      navigate('categories');
      return;
    }
    navigate(fallbackView);
  };

  // --- Memo Operations ---
  const handleCreateMemo = async (data: { user_name?: string; description: string }) => {
    try {
      await memoService.createMemo({
        user_name: data.user_name,
        description: data.description,
        user: user?.id,
      });
    } catch (error) {
      console.error('Failed to create memo:', error);
      throw error;
    }
  };

  const handleLoadMemos = async () => {
    try {
      return await memoService.getMemos();
    } catch (error) {
      console.error('Failed to load memos:', error);
      throw error;
    }
  };

  const handleDeleteMemo = async (id: number) => {
    if (!isAdmin) {
      alert('Seul un administrateur peut supprimer les memos.');
      return;
    }
    try {
      await memoService.deleteMemo(id);
    } catch (error) {
      console.error('Failed to delete memo:', error);
      throw error;
    }
  };

  // --- CRUD Operations ---
  const closeModal = () => setModalState(null);

  // Category
  const handleAddCategory = async (name: string) => {
    if (!requireAdmin()) return;
    try {
      await categoryService.createCategory({ name });
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Erreur lors de la creation de la categorie');
    }
  };

  const handleEditCategory = async (name: string) => {
    if (modalState?.type === 'editCategory') {
      if (!requireAdmin()) return;
      try {
        await categoryService.updateCategory(modalState.category.id, { name });
        await loadCategories();
        closeModal();
      } catch (error) {
        console.error('Failed to update category:', error);
        alert('Erreur lors de la modification de la categorie');
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!requireAdmin()) return;
    try {
      await categoryService.deleteCategory(category.id);
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Erreur lors de la suppression de la categorie');
    }
  };

  const handleReorderCategories = async (orderedIds: number[]) => {
    if (!requireAdmin()) return;
    if (hasSameOrder(categories, orderedIds)) {
      return;
    }
    setCategories((prev) => reorderByIdList(prev, orderedIds));
    try {
      await Promise.all(
        orderedIds.map((id, index) => categoryService.updateCategory(id, { order: index + 1 }))
      );
    } catch (error) {
      console.error('Failed to reorder categories:', error);
      alert("Erreur lors de la mise a jour de l'ordre des categories");
      await loadCategories();
    }
  };

  // Theme (Subject)
  const handleAddTheme = async ({ title, active }: { title: string; active: boolean }) => {
    if (!selectedCategoryId) return;
    if (!requireAdmin()) return;
    try {
      await themeService.createTheme({
        name: title,
        category: selectedCategoryId,
        Active: active,
      });
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to create theme:', error);
      alert('Erreur lors de la creation du sujet');
    }
  };

  const handleEditTheme = async ({ title, active }: { title: string; active: boolean }) => {
    if (modalState?.type === 'editTheme') {
      if (!requireAdmin()) return;
      try {
        await themeService.updateTheme(modalState.theme.id, { name: title, Active: active });
        await loadCategories();
        closeModal();
      } catch (error) {
        console.error('Failed to update theme:', error);
        alert('Erreur lors de la modification du sujet');
      }
    }
  };

  const handleDeleteTheme = async (theme: Theme) => {
    if (!requireAdmin()) return;
    try {
      await themeService.deleteTheme(theme.id);
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to delete theme:', error);
      alert('Erreur lors de la suppression du sujet');
    }
  };

  const handleReorderThemes = async (categoryId: number, orderedIds: number[]) => {
    if (!requireAdmin()) return;
    const targetCategory = categories.find((category) => category.id === categoryId);
    if (!targetCategory || !Array.isArray(targetCategory._theme_of_category_2)) {
      return;
    }
    if (hasSameOrder(targetCategory._theme_of_category_2, orderedIds)) {
      return;
    }
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId || !Array.isArray(category._theme_of_category_2)) {
          return category;
        }
        const reorderedThemes = reorderByIdList(category._theme_of_category_2, orderedIds);
        return { ...category, _theme_of_category_2: reorderedThemes };
      })
    );
    try {
      await Promise.all(
        orderedIds.map((id, index) => themeService.updateTheme(id, { order: index + 1 }))
      );
    } catch (error) {
      console.error('Failed to reorder themes:', error);
      alert("Erreur lors de la mise a jour de l'ordre des sujets");
      await loadCategories();
    }
  };

  // Confession
  const handleAddConfession = async (content: string) => {
    if (!user) {
      openLoginView();
      return;
    }
    if (!selectedThemeId) return;
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
      alert('Erreur lors de la creation de la confession');
    }
  };

  const handleEditConfession = async (content: string) => {
    if (modalState?.type === 'editConfession') {
      if (!canManageConfession(modalState.confession)) {
        alert('Vous ne pouvez pas modifier cette confession.');
        return;
      }
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
    if (!canManageConfession(confession)) {
      alert('Vous ne pouvez pas supprimer cette confession.');
      return;
    }
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
    if (!user) {
      openLoginView();
      return;
    }
    if (!selectedConfessionId) return;
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
      alert('Erreur lors de la creation du commentaire');
    }
  };

  const handleEditComment = async (content: string) => {
    if (modalState?.type === 'editComment') {
      if (!canManageComment(modalState.comment)) {
        alert('Vous ne pouvez pas modifier ce commentaire.');
        return;
      }
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
    if (!canManageComment(comment)) {
      alert('Vous ne pouvez pas supprimer ce commentaire.');
      return;
    }
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

  const handleToggleConfessionLike = async (confession: Confession) => {
    try {
      await likeService.toggleConfessionLike(confession.id);
      await loadConfessionDetail(confession.id);
      if (selectedConfessionId === confession.id) {
        await loadConfessionComments(confession.id);
      }
    } catch (error) {
      console.error('Failed to toggle confession like:', error);
      alert('Erreur lors de la mise a jour du like de la confession');
    }
  };

  const handleShareConfession = async (confession: Confession) => {
    let location =
      findConfessionLocationInCategories(categories, confession.id) ??
      (confession._theme
        ? {
            categoryId:
              confession._theme.category ??
              (confession._theme as any)?.category_id ??
              selectedCategoryId ??
              null,
            themeId: confession._theme.id ?? confession.theme ?? null,
          }
        : null);

    if (!location || !location.categoryId || !location.themeId) {
      const resolved = await resolveConfessionLocation(confession.id, {
        categoryId: location?.categoryId ?? selectedCategoryId,
        themeId: location?.themeId ?? selectedThemeId ?? confession.theme ?? null,
      });
      if (resolved) {
        location = resolved;
      }
    }

    if (!location || !location.categoryId || !location.themeId) {
      alert("Impossible de generer le lien de partage pour le moment.");
      return;
    }

    const shareState: NavigationState = {
      view: 'confessionDetail',
      categoryId: location.categoryId,
      themeId: location.themeId,
      confessionId: confession.id,
    };
    const sharePath = buildUrlFromState(shareState);
    const shareUrl = new URL(sharePath, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Confession ConnexXxion',
          url: shareUrl,
        });
        return;
      }
    } catch (error) {
      console.warn('Partage systeme indisponible, utilisation du presse-papiers.', error);
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Lien copie dans le presse-papiers !');
    } catch (error) {
      console.error('Failed to copy confession link:', error);
      window.prompt('Copiez ce lien :', shareUrl);
    }
  };

  const handleToggleCommentLike = async (comment: Comment) => {
    try {
      const confessionId = comment.confession ?? selectedConfessionId;
      if (!confessionId) {
        return;
      }
      await likeService.toggleCommentLike(comment.id);
      await loadConfessionComments(confessionId);
      await loadConfessionDetail(confessionId);
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
      alert('Erreur lors de la mise a jour du like du commentaire');
    }
  };

  const handleMobileAdd = () => {
    if (!showMobileAddButton) {
      return;
    }
    if (!user) {
      openLoginView();
      return;
    }

    switch (view) {
      case 'categories':
        openAddCategoryModal();
        break;
      case 'subjects':
        openAddThemeModal();
        break;
      case 'confessions':
        openAddConfessionModal();
        break;
      case 'confessionDetail':
        openAddCommentModal();
        break;
      default:
        break;
    }
  };

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
            onAddCategory={openAddCategoryModal}
            onEditCategory={openEditCategoryModal}
            onDeleteCategory={openDeleteCategoryModal}
            canModify={() => canManageCategory()}
            onReorderCategories={handleReorderCategories}
          />
        );
      case 'subjects':
        if (!selectedCategory) return <div>Categorie non trouvee</div>;
        return (
          <SubjectsPage
            category={selectedCategory}
            onSelectSubject={(id: number) => navigate('confessions', selectedCategoryId, id)}
            onBack={handleBack}
            onAddSubject={openAddThemeModal}
            onEditSubject={openEditThemeModal}
            onDeleteSubject={openDeleteThemeModal}
            canModify={() => canManageTheme()}
            onReorderSubjects={(orderedIds) => handleReorderThemes(selectedCategory.id, orderedIds)}
          />
        );
      case 'confessions':
        if (!selectedTheme) return <div>Sujet non trouve</div>;
        return (
          <ConfessionsPage
            subject={selectedTheme}
            onSelectConfession={(id: number) => navigate('confessionDetail', selectedCategoryId, selectedThemeId, id)}
            onBack={handleBack}
            onAddConfession={openAddConfessionModal}
            onEditConfession={openEditConfessionModal}
            onDeleteConfession={openDeleteConfessionModal}
            onToggleConfessionLike={handleToggleConfessionLike}
            canModify={canModifyConfessionForUI}
            isAuthenticated={isAuthenticated}
            onRequestLogin={promptLoginForFullExperience}
          />
        );
      case 'confessionDetail':
        if (!selectedConfession) return <div>Confession non trouvee</div>;
        return (
          <ConfessionDetailPage
            confession={selectedConfession}
            onBack={handleBack}
            onAddComment={openAddCommentModal}
            onEditComment={openEditCommentModal}
            onDeleteComment={openDeleteCommentModal}
            onToggleConfessionLike={handleToggleConfessionLike}
            onToggleCommentLike={handleToggleCommentLike}
            canModify={canManageComment}
            isAuthenticated={isAuthenticated}
            onRequestLogin={promptLoginForFullExperience}
            onShareConfession={handleShareConfession}
          />
        );
      case 'login':
        return <LoginPage onLogin={handleLoginSuccess} />;
      case 'donations':
        return <DonationsPage onBack={handleDonationBack} onMemoSubmit={handleCreateMemo} />;
      case 'memos':
        return <MemosPage onBack={() => navigate('home')} onLoadMemos={handleLoadMemos} onDeleteMemo={handleDeleteMemo} />;
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
      {!isLoginView && (
        <Header
          onHomeClick={() => navigate('home')}
          onCategoriesClick={() => navigate('categories')}
          onMemosClick={isAdmin ? () => navigate('memos') : undefined}
          userId={user?.name || null}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          onLogin={openLoginView}
        />
      )}
      <main className={mainClassName}>{renderContent()}</main>
      {!isLoginView && (
        <MobileNav
          currentView={view}
          onHomeClick={() => navigate('home')}
          onCategoriesClick={() => navigate('categories')}
          onMemosClick={isAdmin ? () => navigate('memos') : undefined}
          onAddClick={handleMobileAdd}
          showAddButton={showMobileAddButton}
          showMemosButton={isAdmin}
        />
      )}
      {!isLoginView && view !== 'home' && view !== 'donations' && view !== 'memos' && (
        <DonationButton onClick={openDonations} />
      )}
      {!isLoginView && renderModal()}
      {!isLoginView && <div className="pb-20 md:pb-0"></div>}
    </div>
  );
};

export default App;

