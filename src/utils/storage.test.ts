import { describe, it, expect, beforeEach } from 'vitest';
import { isStorageAvailable, readJSON, writeJSON, removeKey } from './storage';
import { HISTORY_LIMIT, STORAGE_KEYS } from '../types';

describe('storage utilities', () => {
  beforeEach(() => {
    try {
      window.localStorage?.clear?.();
    } catch {
      /* ignore */
    }
  });

  it('isStorageAvailable returns true in jsdom', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('readJSON returns fallback when key is missing', () => {
    expect(readJSON('missing-key', { value: 0 })).toEqual({ value: 0 });
  });

  it('writeJSON then readJSON round-trips a value', () => {
    const payload = { value: 42, history: [{ value: 42, at: 1 }] };
    expect(writeJSON(STORAGE_KEYS.counter, payload)).toBe(true);
    expect(readJSON(STORAGE_KEYS.counter, { value: 0, history: [] })).toEqual(payload);
  });

  it('readJSON returns fallback when stored value is invalid JSON', () => {
    window.localStorage.setItem(STORAGE_KEYS.counter, '{not-json');
    expect(readJSON(STORAGE_KEYS.counter, { value: 0 })).toEqual({ value: 0 });
  });

  it('removeKey deletes the stored value', () => {
    writeJSON(STORAGE_KEYS.settings, { theme: 'dark' });
    expect(removeKey(STORAGE_KEYS.settings)).toBe(true);
    expect(readJSON(STORAGE_KEYS.settings, { theme: 'light' })).toEqual({ theme: 'light' });
  });

  it('HISTORY_LIMIT equals 5 per PRD', () => {
    expect(HISTORY_LIMIT).toBe(5);
  });

  it('STORAGE_KEYS are namespaced to avoid collisions', () => {
    expect(STORAGE_KEYS.counter).toMatch(/^sayac-38192:/);
    expect(STORAGE_KEYS.settings).toMatch(/^sayac-38192:/);
  });
});
