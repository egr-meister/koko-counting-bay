/**
 * Progress helpers for sea stickers.
 * Stickers are local learning markers only — they have NO money value and are
 * never coins, prizes, or rewards.
 */
import { getUnlockedStickerIds } from '../data/stickerItems';

/** A fresh progress object with no stickers unlocked yet. */
export function createDefaultProgress() {
  return { unlockedStickerIds: [] };
}

/** Merge stored progress onto defaults so the shape is always valid. */
export function mergeProgress(stored) {
  const base = createDefaultProgress();
  if (!stored || typeof stored !== 'object') return base;
  const ids = Array.isArray(stored.unlockedStickerIds) ? stored.unlockedStickerIds : [];
  base.unlockedStickerIds = ids.filter((id) => typeof id === 'string');
  return base;
}

/**
 * Recompute unlocked stickers from current stats and union with any already
 * unlocked. Returns a new progress object.
 */
export function updateUnlockedStickers(progress, stats) {
  const current = mergeProgress(progress);
  const earned = getUnlockedStickerIds(stats);
  const union = new Set([...current.unlockedStickerIds, ...earned]);
  return { unlockedStickerIds: Array.from(union) };
}

/** Safe accessor for unlocked sticker ids. */
export function getStickerIds(progress) {
  return mergeProgress(progress).unlockedStickerIds;
}

/** Returns fresh default progress (used when resetting). */
export function resetProgress() {
  return createDefaultProgress();
}

export default createDefaultProgress;
