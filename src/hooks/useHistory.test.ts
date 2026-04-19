import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useHistory } from './useHistory';
import { HISTORY_LIMIT } from '../types';

describe('useHistory', () => {
  it('starts empty by default', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('seeds with provided initial entries (sliced to limit)', () => {
    const seed = Array.from({ length: 10 }, (_, i) => ({ value: i, at: i }));
    const { result } = renderHook(() => useHistory(seed));
    expect(result.current.history.length).toBe(HISTORY_LIMIT);
    expect(result.current.history[0]?.value).toBe(0);
  });

  it('records new entries at the front of the list', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.record(1));
    act(() => result.current.record(2));
    act(() => result.current.record(3));
    expect(result.current.history.map((entry) => entry.value)).toEqual([3, 2, 1]);
  });

  it('respects HISTORY_LIMIT (5) — drops the oldest beyond cap', () => {
    const { result } = renderHook(() => useHistory());
    for (let i = 1; i <= 7; i += 1) {
      act(() => result.current.record(i));
    }
    expect(result.current.history.length).toBe(HISTORY_LIMIT);
    expect(result.current.history.map((entry) => entry.value)).toEqual([7, 6, 5, 4, 3]);
  });

  it('stamps `at` with a finite number for every recorded entry', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.record(42));
    const [entry] = result.current.history;
    expect(entry).toBeDefined();
    expect(typeof entry?.at).toBe('number');
    expect(Number.isFinite(entry?.at)).toBe(true);
  });

  it('ignores non-finite values passed to record', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.record(Number.NaN));
    act(() => result.current.record(Number.POSITIVE_INFINITY));
    expect(result.current.history).toEqual([]);
  });

  it('replace overwrites the list and re-applies the cap', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.record(1));
    const replacement = Array.from({ length: 8 }, (_, i) => ({ value: i + 10, at: i }));
    act(() => result.current.replace(replacement));
    expect(result.current.history.length).toBe(HISTORY_LIMIT);
    expect(result.current.history[0]?.value).toBe(10);
  });

  it('replace filters out malformed entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() =>
      result.current.replace([
        { value: 1, at: 1 },
        { value: Number.NaN, at: 2 } as never,
        { value: 3, at: 'not-a-time' } as never,
        { value: 4, at: 4 },
      ]),
    );
    expect(result.current.history.map((entry) => entry.value)).toEqual([1, 4]);
  });

  it('clear empties the history list', () => {
    const { result } = renderHook(() => useHistory([{ value: 1, at: 1 }]));
    act(() => result.current.clear());
    expect(result.current.history).toEqual([]);
  });

  it('respects a custom limit when supplied', () => {
    const { result } = renderHook(() => useHistory([], 2));
    act(() => result.current.record(1));
    act(() => result.current.record(2));
    act(() => result.current.record(3));
    expect(result.current.history.map((entry) => entry.value)).toEqual([3, 2]);
  });
});
