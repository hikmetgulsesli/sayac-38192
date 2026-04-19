import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';
import { HISTORY_LIMIT, STORAGE_KEYS } from '../types';
import { readJSON } from '../utils/storage';

describe('useCounter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts at 0 with empty history when storage is empty', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.value).toBe(0);
    expect(result.current.history).toEqual([]);
  });

  it('increments by 1 when no step is given', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.value).toBe(1);
  });

  it('increments by an explicit step', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(10));
    act(() => result.current.increment(50));
    expect(result.current.value).toBe(60);
  });

  it('decrements by 1 when no step is given', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(5));
    act(() => result.current.decrement());
    expect(result.current.value).toBe(4);
  });

  it('decrements by an explicit step and may go negative', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.decrement(7));
    expect(result.current.value).toBe(-7);
  });

  it('reset returns the value to 0', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(42));
    act(() => result.current.reset());
    expect(result.current.value).toBe(0);
  });

  it('setValue truncates non-integer inputs and ignores invalid numbers', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.setValue(7.9));
    expect(result.current.value).toBe(7);
    act(() => result.current.setValue(Number.NaN));
    expect(result.current.value).toBe(0);
  });

  it('records each new value in history (newest first)', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(1));
    act(() => result.current.increment(1));
    act(() => result.current.increment(1));
    const values = result.current.history.map((entry) => entry.value);
    expect(values).toEqual([3, 2, 1]);
    for (const entry of result.current.history) {
      expect(typeof entry.at).toBe('number');
      expect(Number.isFinite(entry.at)).toBe(true);
    }
  });

  it('caps history at HISTORY_LIMIT entries (5)', () => {
    const { result } = renderHook(() => useCounter());
    for (let i = 0; i < 10; i += 1) {
      act(() => result.current.increment(1));
    }
    expect(result.current.history.length).toBe(HISTORY_LIMIT);
    expect(result.current.history[0]?.value).toBe(10);
    expect(result.current.history[HISTORY_LIMIT - 1]?.value).toBe(6);
  });

  it('persists value and history to localStorage', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(3));
    act(() => result.current.decrement(1));
    const saved = readJSON<{ value: number; history: { value: number }[] }>(
      STORAGE_KEYS.counter,
      { value: -1, history: [] },
    );
    expect(saved.value).toBe(2);
    expect(saved.history.map((entry) => entry.value)).toEqual([2, 3]);
  });

  it('rehydrates from localStorage on mount', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.counter,
      JSON.stringify({
        value: 99,
        history: [
          { value: 99, at: 3 },
          { value: 50, at: 2 },
          { value: 0, at: 1 },
        ],
      }),
    );
    const { result } = renderHook(() => useCounter());
    expect(result.current.value).toBe(99);
    expect(result.current.history.map((entry) => entry.value)).toEqual([99, 50, 0]);
  });

  it('falls back to defaults when stored payload is corrupt', () => {
    window.localStorage.setItem(STORAGE_KEYS.counter, '{not-valid-json');
    const { result } = renderHook(() => useCounter());
    expect(result.current.value).toBe(0);
    expect(result.current.history).toEqual([]);
  });

  it('rejects non-finite stored values and history entries', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.counter,
      JSON.stringify({
        value: 'oops',
        history: [
          { value: 'bad', at: 1 },
          { value: 5, at: 'nope' },
          { value: 7, at: 2 },
        ],
      }),
    );
    const { result } = renderHook(() => useCounter());
    expect(result.current.value).toBe(0);
    expect(result.current.history.map((entry) => entry.value)).toEqual([7]);
  });

  it('ignores invalid step inputs and treats them as the default 1', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment(Number.NaN));
    expect(result.current.value).toBe(1);
    act(() => result.current.decrement(Number.POSITIVE_INFINITY));
    expect(result.current.value).toBe(0);
  });
});
