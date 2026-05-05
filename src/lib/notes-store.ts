
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const STORAGE_KEY = 'not_elfbeh_notes';

export function getLocalNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalNotes(notes: Note[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function createEmptyNote(): Note {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled Note',
    content: '',
    updatedAt: Date.now(),
  };
}
