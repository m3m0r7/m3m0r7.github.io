import { LEVELS } from "./levels.js";

export const SCORE_STORAGE_KEY = "spaghetti-code:scores:v1";
export const MAX_LOCAL_RANKING_ENTRIES = 5;
const SCORE_LEVEL_KEYS = Object.freeze(Object.keys(LEVELS));

function createEmptyRankings() {
  return Object.fromEntries(SCORE_LEVEL_KEYS.map((levelKey) => [levelKey, []]));
}

function normalizeCompletedAt(value) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function normalizeRecord(record, fallbackDifficulty = null) {
  if (!record || typeof record !== "object") return null;
  const difficulty = typeof record.difficulty === "string" ? record.difficulty : fallbackDifficulty;
  const elapsedMs = Number(record.elapsedMs);
  if (!LEVELS[difficulty] || !Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return {
    difficulty,
    cableCount: LEVELS[difficulty].count,
    elapsedMs: Math.floor(elapsedMs),
    completedAt: normalizeCompletedAt(record.completedAt ?? record.createdAt),
  };
}

function scoreSignature(record) {
  return `${record.difficulty}:${record.elapsedMs}:${record.completedAt ?? ""}`;
}

function sortAndLimit(records) {
  const uniqueRecords = new Map();
  records.forEach((record) => uniqueRecords.set(scoreSignature(record), record));
  return [...uniqueRecords.values()]
    .sort((left, right) => {
      const timeDifference = left.elapsedMs - right.elapsedMs;
      if (timeDifference !== 0) return timeDifference;
      return (left.completedAt ?? "").localeCompare(right.completedAt ?? "");
    })
    .slice(0, MAX_LOCAL_RANKING_ENTRIES);
}

function collectRecord(target, record, fallbackDifficulty = null) {
  const normalized = normalizeRecord(record, fallbackDifficulty);
  if (normalized) target[normalized.difficulty].push(normalized);
}

export function normalizeScoreStore(storedValue) {
  const rankings = createEmptyRankings();
  if (!storedValue || typeof storedValue !== "object") return rankings;

  if (Array.isArray(storedValue)) {
    storedValue.forEach((record) => collectRecord(rankings, record));
  } else {
    const groupedScores = storedValue.byDifficulty ?? storedValue;
    SCORE_LEVEL_KEYS.forEach((levelKey) => {
      if (!Array.isArray(groupedScores[levelKey])) return;
      groupedScores[levelKey].forEach((record) => collectRecord(rankings, record, levelKey));
    });

    [storedValue.best, storedValue.recent].forEach((legacyRecords) => {
      if (!Array.isArray(legacyRecords)) return;
      legacyRecords.forEach((record) => collectRecord(rankings, record));
    });
  }

  SCORE_LEVEL_KEYS.forEach((levelKey) => {
    rankings[levelKey] = sortAndLimit(rankings[levelKey]);
  });
  return rankings;
}

export function readLocalRankings(storage = globalThis.localStorage) {
  if (!storage) return createEmptyRankings();
  try {
    const rawValue = storage.getItem(SCORE_STORAGE_KEY);
    if (!rawValue) return createEmptyRankings();
    return normalizeScoreStore(JSON.parse(rawValue));
  } catch {
    return createEmptyRankings();
  }
}

export function saveLocalScore(record, storage = globalThis.localStorage) {
  const normalizedRecord = normalizeRecord(record);
  const rankings = readLocalRankings(storage);
  if (!normalizedRecord || !storage) return { saved: false, rankings };

  rankings[normalizedRecord.difficulty] = sortAndLimit([
    ...rankings[normalizedRecord.difficulty],
    normalizedRecord,
  ]);

  try {
    storage.setItem(SCORE_STORAGE_KEY, JSON.stringify({
      version: 2,
      byDifficulty: rankings,
    }));
    return { saved: true, rankings };
  } catch {
    return { saved: false, rankings };
  }
}
