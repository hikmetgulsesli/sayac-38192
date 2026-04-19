import { useEffect, useState } from 'react';
import type { ThemeMode } from './types';
import { STORAGE_KEYS } from './types';
import { readJSON, writeJSON } from './utils/storage';

function getInitialTheme(): ThemeMode {
  const saved = readJSON<{ theme?: ThemeMode }>(STORAGE_KEYS.settings, {});
  if (saved.theme === 'light' || saved.theme === 'dark') return saved.theme;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    writeJSON(STORAGE_KEYS.settings, { theme });
  }, [theme]);

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-background text-on-background px-6"
      aria-labelledby="sayac-baslik"
    >
      <h1 id="sayac-baslik" className="font-headline text-4xl font-bold text-primary">
        Sayaç-38192
      </h1>
      <p className="font-body text-on-surface-variant max-w-md text-center">
        Proje kurulumu ve tasarım sistemi hazır. Sonraki hikâyelerde sayaç, geçmiş ve ayarlar
        ekranları eklenecek.
      </p>
      <button
        type="button"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        aria-label="Tema değiştir"
        className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 font-label font-semibold text-on-surface hover:bg-surface-container-highest focus-visible:outline-primary transition-colors"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
        {theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
      </button>
    </main>
  );
}
