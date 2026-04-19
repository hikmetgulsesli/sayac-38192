export function isStorageAvailable(): boolean {
  try {
    const probe = '__sayac_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
