import { useCallback, useEffect, useRef, useState } from 'react';
import type { CounterState, HistoryEntry } from '../types';
import { HISTORY_LIMIT, STORAGE_KEYS } from '../types';
import { readJSON, writeJSON } from '../utils/storage';
import { useHistory } from './useHistory';

export interface UseCounterResult {
  value: number;
  history: HistoryEntry[];
  increment: (by?: number) => void;
  decrement: (by?: number) => void;
  reset: () => void;
  setValue: (next: number) => void;
}

const DEFAULT_STATE: CounterState = { value: 0, history: [] };

function normalizeValue(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.trunc(value);
}

function normalizeHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (entry): entry is HistoryEntry =>
        !!entry &&
        typeof (entry as HistoryEntry).value === 'number' &&
        Number.isFinite((entry as HistoryEntry).value) &&
        typeof (entry as HistoryEntry).at === 'number' &&
        Number.isFinite((entry as HistoryEntry).at),
    )
    .slice(0, HISTORY_LIMIT);
}

function loadInitial(): CounterState {
  const saved = readJSON<Partial<CounterState>>(
    STORAGE_KEYS.counter,
    DEFAULT_STATE,
  );
  return {
    value: normalizeValue(saved.value),
    history: normalizeHistory(saved.history),
  };
}

function normalizeStep(raw: number | undefined, fallback: number): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return fallback;
  return Math.trunc(raw);
}

export function useCounter(): UseCounterResult {
  const initialRef = useRef<CounterState | null>(null);
  if (initialRef.current === null) {
    initialRef.current = loadInitial();
  }
  const initial = initialRef.current;

  const [value, setValueState] = useState<number>(initial.value);
  const { history, record } = useHistory(initial.history);

  const lastRecordedRef = useRef<number>(initial.value);
  useEffect(() => {
    if (value !== lastRecordedRef.current) {
      lastRecordedRef.current = value;
      record(value);
    }
  }, [value, record]);

  useEffect(() => {
    writeJSON<CounterState>(STORAGE_KEYS.counter, { value, history });
  }, [value, history]);

  const increment = useCallback((by?: number) => {
    const step = normalizeStep(by, 1);
    setValueState((prev) => prev + step);
  }, []);

  const decrement = useCallback((by?: number) => {
    const step = normalizeStep(by, 1);
    setValueState((prev) => prev - step);
  }, []);

  const reset = useCallback(() => {
    setValueState(0);
  }, []);

  const setValue = useCallback((next: number) => {
    setValueState(normalizeValue(next));
  }, []);

  return { value, history, increment, decrement, reset, setValue };
}
