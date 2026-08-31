import { LEVELS } from "./config.js";

export const SCORE_STORAGE_KEY = "shredder:scores:v1";
export const MAX_RANKING_ENTRIES = 5;

function emptyRankings() {
  return Object.fromEntries(Object.keys(LEVELS).map((levelKey) => [levelKey, []]));
}

function normalizeRecord(record, fallbackDifficulty = null) {
  if (!record || typeof record !== "object") return null;
  const difficulty = typeof record.difficulty === "string" ? record.difficulty : fallbackDifficulty;
  const elapsedMs = Number(record.elapsedMs);
  if (!LEVELS[difficulty] || !Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  const parsedDate = typeof record.completedAt === "string" ? Date.parse(record.completedAt) : NaN;
  return {
    difficulty,
    documentCount: LEVELS[difficulty].count,
    elapsedMs: Math.floor(elapsedMs),
    completedAt: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : null,
  };
}

function sortAndLimit(records) {
  const unique = new Map();
  records.forEach((record) => unique.set(`${record.difficulty}:${record.elapsedMs}:${record.completedAt ?? ""}`, record));
  return [...unique.values()]
    .sort((left, right) => left.elapsedMs - right.elapsedMs || (left.completedAt ?? "").localeCompare(right.completedAt ?? ""))
    .slice(0, MAX_RANKING_ENTRIES);
}

export function normalizeScoreStore(value) {
  const rankings = emptyRankings();
  if (!value || typeof value !== "object") return rankings;
  const grouped = value.byDifficulty ?? value;
  Object.keys(LEVELS).forEach((levelKey) => {
    if (!Array.isArray(grouped[levelKey])) return;
    grouped[levelKey].forEach((record) => {
      const normalized = normalizeRecord(record, levelKey);
      if (normalized) rankings[levelKey].push(normalized);
    });
    rankings[levelKey] = sortAndLimit(rankings[levelKey]);
  });
  return rankings;
}

export function readLocalRankings(storage = globalThis.localStorage) {
  if (!storage) return emptyRankings();
  try {
    const raw = storage.getItem(SCORE_STORAGE_KEY);
    return raw ? normalizeScoreStore(JSON.parse(raw)) : emptyRankings();
  } catch {
    return emptyRankings();
  }
}

export function saveLocalScore(record, storage = globalThis.localStorage) {
  const normalized = normalizeRecord(record);
  const rankings = readLocalRankings(storage);
  if (!normalized || !storage) return { saved: false, rankings };
  rankings[normalized.difficulty] = sortAndLimit([...rankings[normalized.difficulty], normalized]);
  try {
    storage.setItem(SCORE_STORAGE_KEY, JSON.stringify({ version: 1, byDifficulty: rankings }));
    return { saved: true, rankings };
  } catch {
    return { saved: false, rankings };
  }
}
