import { useCallback, useState } from 'react';
import type { HistoryEntry } from '../types';
import { HISTORY_LIMIT } from '../types';

export interface UseHistoryResult {
  history: HistoryEntry[];
  record: (value: number) => void;
  replace: (items: HistoryEntry[]) => void;
  clear: () => void;
}

function now(): number {
  return Date.now();
}

function normalize(items: HistoryEntry[], limit: number): HistoryEntry[] {
  if (!Array.isArray(items)) return [];
  const safe = items.filter(
    (entry): entry is HistoryEntry =>
      !!entry &&
      typeof entry.value === 'number' &&
      Number.isFinite(entry.value) &&
      typeof entry.at === 'number' &&
      Number.isFinite(entry.at),
  );
  return safe.slice(0, Math.max(0, limit));
}

export function useHistory(
  initial: HistoryEntry[] = [],
  limit: number = HISTORY_LIMIT,
): UseHistoryResult {
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    normalize(initial, limit),
  );

  const record = useCallback(
    (value: number) => {
      if (!Number.isFinite(value)) return;
      setHistory((prev) => {
        const next: HistoryEntry[] = [{ value, at: now() }, ...prev];
        return next.slice(0, Math.max(0, limit));
      });
    },
    [limit],
  );

  const replace = useCallback(
    (items: HistoryEntry[]) => {
      setHistory(normalize(items, limit));
    },
    [limit],
  );

  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, record, replace, clear };
}
