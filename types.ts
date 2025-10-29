export interface Comment {
  id: string;
  confessionId: string;
  author: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Confession {
  id: string;
  subjectId: string;
  content: string;
  author: string;
  userId: string;
  timestamp: string;
  peach_likes: number;
  grape_likes: number;
  comments: Comment[];
}

export interface Subject {
  id: string;
  categoryId: string;
  userId: string;
  title: string;
  confessions: Confession[];
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  subjects: Subject[];
}

export type View = 'home' | 'categories' | 'subjects' | 'confessions' | 'confessionDetail';

export type ModalState =
  | null
  | { type: 'addCategory' }
  | { type: 'editCategory'; category: Category }
  | { type: 'addSubject' }
  | { type: 'editSubject'; subject: Subject }
  | { type: 'addConfession' }
  | { type: 'editConfession'; confession: Confession }
  | { type: 'addComment' }
  | { type: 'editComment'; comment: Comment }
  | { type: 'confirmDelete'; onConfirm: () => void; message: string };
