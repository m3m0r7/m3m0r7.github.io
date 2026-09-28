export const HISTORY_KEY = 'engineer-escape:dialogue:v2';
export const HISTORY_LIMIT = 240;
export function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(entry => entry && typeof entry.text === 'string' && entry.text.length > 0 && entry.text.length <= 1200 && Number.isSafeInteger(entry.elapsed) && entry.elapsed >= 0 && ['opening','explore'].includes(entry.kind)).slice(-HISTORY_LIMIT).map(({text,elapsed,kind})=>({text,elapsed,kind}));
}
export function readHistory(storage) { try { return normalizeHistory(JSON.parse(storage.getItem(HISTORY_KEY))); } catch { return []; } }
export function saveHistory(storage,history) { try { storage.setItem(HISTORY_KEY,JSON.stringify(normalizeHistory(history))); return true; } catch { return false; } }
