/**
 * Local-only persistence using AsyncStorage.
 *
 * Stores ONLY: learning stats, sticker progress, and app settings.
 * No personal data, names, age, location, device ids, or behavioral tracking.
 * No network, no cloud sync. Everything stays on the device.
 *
 * Robustness rules:
 *  - Empty storage returns complete default data.
 *  - Loaded data is always merged onto defaults.
 *  - Corrupted JSON is caught and replaced with defaults (never crashes).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mergeStats, createDefaultStats, recordAnswer, recordCompletedGame as recordCompletedGameStat, resetStats }
  from '../utils/statsHelpers';
import { mergeProgress, createDefaultProgress, updateUnlockedStickers, resetProgress }
  from '../utils/progressHelpers';

const STORAGE_KEY = 'koko_counting_bay_v1';

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  defaultDifficulty: 'easy',
  theme: 'kokoSunnyBay',
};

/** A complete default data object covering stats, progress, and settings. */
export function createDefaultAppData() {
  return {
    stats: createDefaultStats(),
    progress: createDefaultProgress(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

function mergeSettings(stored) {
  const base = { ...DEFAULT_SETTINGS };
  if (!stored || typeof stored !== 'object') return base;
  if (typeof stored.soundEnabled === 'boolean') base.soundEnabled = stored.soundEnabled;
  if (['easy', 'medium', 'hard'].includes(stored.defaultDifficulty)) {
    base.defaultDifficulty = stored.defaultDifficulty;
  }
  // Only one theme exists in this version.
  base.theme = 'kokoSunnyBay';
  return base;
}

/** Merge any loaded object onto a fresh, complete default. */
export function mergeAppData(stored) {
  return {
    stats: mergeStats(stored?.stats),
    progress: mergeProgress(stored?.progress),
    settings: mergeSettings(stored?.settings),
  };
}

/** Load app data. Always resolves to complete, valid data. */
export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultAppData();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      // Corrupted JSON — start fresh rather than crash.
      return createDefaultAppData();
    }
    return mergeAppData(parsed);
  } catch (e) {
    return createDefaultAppData();
  }
}

/** Persist a full data object (after merging onto defaults). Returns the saved data. */
export async function saveAppData(data) {
  const safe = mergeAppData(data);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch (e) {
    // Ignore write failures; in-memory state still works for this session.
  }
  return safe;
}

/**
 * Record one answer: update stats and recompute unlocked stickers.
 * Returns the new, complete app data.
 */
export async function recordLearningAnswer(gameMode, isCorrect) {
  const data = await loadAppData();
  const stats = recordAnswer(data.stats, gameMode, isCorrect);
  const progress = updateUnlockedStickers(data.progress, stats);
  return saveAppData({ ...data, stats, progress });
}

/** Record one completed game session. Returns the new app data. */
export async function recordCompletedGame() {
  const data = await loadAppData();
  const stats = recordCompletedGameStat(data.stats);
  const progress = updateUnlockedStickers(data.progress, stats);
  return saveAppData({ ...data, stats, progress });
}

/** Reset only the learning statistics. */
export async function resetCountingStats() {
  const data = await loadAppData();
  return saveAppData({ ...data, stats: resetStats() });
}

/** Reset only the sticker progress. */
export async function resetCountingProgress() {
  const data = await loadAppData();
  return saveAppData({ ...data, progress: resetProgress() });
}

/** Update settings (merged onto current). Returns the new app data. */
export async function updateSettings(settings) {
  const data = await loadAppData();
  const merged = mergeSettings({ ...data.settings, ...settings });
  return saveAppData({ ...data, settings: merged });
}

/** Clear ALL local data and restore defaults. */
export async function clearAllData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore.
  }
  return saveAppData(createDefaultAppData());
}

export default {
  loadAppData,
  saveAppData,
  recordLearningAnswer,
  recordCompletedGame,
  resetCountingStats,
  resetCountingProgress,
  updateSettings,
  clearAllData,
};
