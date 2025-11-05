// ============================================
// Backend API Types (matching Xano structure)
// ============================================

export interface User {
  id: number;
  created_at: string;
  name: string;
  email?: string;
  role?: string;
  sex?: number;
}

export interface Comment {
  id: number;
  created_at: string;
  user: number; // FK to user table
  confession: number; // FK to confession table
  content: string;
  like_count: number;
  // Addon fields
  _user_object?: User;
  _is_liked?: boolean;
}

export interface Confession {
  id: number;
  created_at: string;
  user: number; // FK to user table
  theme: number; // FK to theme table
  title: string;
  content: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  number_of_like?: number;
  number_of_comments?: number;
  is_liked?: boolean | number;
  // Addon fields
  _theme?: Theme;
  _user_object?: User;
  _comment_of_confession?: Comment[];
  real_like_count?: number;
  _is_liked?: boolean;
}

export interface Theme {
  id: number;
  created_at: string;
  name: string;
  category: number; // FK to category table
  user?: number;
  description?: string;
  number_of_confess: number;
  Active?: boolean;
  order?: number;
  // Addon fields
  _category?: Category;
  _confession?: Confession[];
}

export interface Category {
  id: number;
  created_at: string;
  name: string;
  user?: number;
  theme_count?: number;
  order?: number;
  // Addon fields
  _theme_of_category_2?: Theme[];
}

export interface ConfessionLike {
  id: number;
  created_at: string;
  confession: number;
  device_id: string;
}

export interface CommentLike {
  id: number;
  created_at: string;
  comment: number;
  device_id: string;
}

export interface ConfessionView {
  id: number;
  created_at: string;
  confession: number;
  device_id: string;
}

export interface Memo {
  id: number;
  created_at: string;
  user_name?: string;
  description: string;
  user?: number;
  // Addon fields
  _user_object?: User;
}

// ============================================
// Authentication Types
// ============================================

export interface AuthResponse {
  authToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  sex: number;
  sexe?: number;
}

// ============================================
// Frontend UI Types
// ============================================

export type View = 'home' | 'categories' | 'subjects' | 'confessions' | 'confessionDetail' | 'login' | 'donations' | 'memos';

export type ModalState =
  | null
  | { type: 'addCategory' }
  | { type: 'editCategory'; category: Category }
  | { type: 'addTheme' }
  | { type: 'editTheme'; theme: Theme }
  | { type: 'addConfession' }
  | { type: 'editConfession'; confession: Confession }
  | { type: 'addComment' }
  | { type: 'editComment'; comment: Comment }
  | { type: 'confirmDelete'; onConfirm: () => void; message: string };

// ============================================
// Type Aliases for backward compatibility
// ============================================

export type Subject = Theme; // Subject is now Theme in backend
