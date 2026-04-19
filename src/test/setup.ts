import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function ensureStorage(name: 'localStorage' | 'sessionStorage'): void {
  const current = (window as unknown as Record<string, unknown>)[name];
  const usable =
    current &&
    typeof (current as Storage).setItem === 'function' &&
    typeof (current as Storage).getItem === 'function';
  if (!usable) {
    Object.defineProperty(window, name, {
      configurable: true,
      value: new MemoryStorage(),
    });
  }
}

ensureStorage('localStorage');
ensureStorage('sessionStorage');

afterEach(() => {
  cleanup();
  try {
    window.localStorage.clear();
  } catch {
    /* storage not available */
  }
});
