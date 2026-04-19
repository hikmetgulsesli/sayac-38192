import { useCallback, useEffect, useState } from 'react';
import type { AppSettings, ThemeMode } from '../types';
import { STORAGE_KEYS } from '../types';
import { readJSON, writeJSON } from '../utils/storage';

export interface UseThemeResult {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggle: () => void;
}

function prefersLight(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  } catch {
    return false;
  }
}

function getInitialTheme(): ThemeMode {
  const saved = readJSON<Partial<AppSettings>>(STORAGE_KEYS.settings, {});
  if (saved.theme === 'light' || saved.theme === 'dark') return saved.theme;
  return prefersLight() ? 'light' : 'dark';
}

function applyThemeClass(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!root) return;
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
}

export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyThemeClass(theme);
    writeJSON<AppSettings>(STORAGE_KEYS.settings, { theme });
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggle };
}
