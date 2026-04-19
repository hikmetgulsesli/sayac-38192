export type ThemeMode = 'light' | 'dark';

export interface HistoryEntry {
  value: number;
  at: number;
}

export interface CounterState {
  value: number;
  history: HistoryEntry[];
}

export interface AppSettings {
  theme: ThemeMode;
}

export const HISTORY_LIMIT = 5;

export const STORAGE_KEYS = {
  counter: 'sayac-38192:counter',
  settings: 'sayac-38192:settings',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
