/**
 * Sea stickers — local learning progress markers only.
 * Stickers are badges for encouragement. They have NO money value and are not
 * coins, prizes, or rewards of any kind.
 */
export const STICKER_ITEMS = [
  {
    id: 'first_fish',
    title: 'First Fish Sticker',
    emoji: '🐟',
    description: 'Answer your first question correctly.',
    isUnlocked: (stats) => safeNum(stats?.correct) >= 1,
  },
  {
    id: 'shell_counter',
    title: 'Shell Counter Sticker',
    emoji: '🐚',
    description: 'Answer 5 Count and Choose questions correctly.',
    isUnlocked: (stats) => safeNum(stats?.byGameMode?.count_choose?.correct) >= 5,
  },
  {
    id: 'crab_compare',
    title: 'Crab Compare Sticker',
    emoji: '🦀',
    description: 'Answer 5 More or Less questions correctly.',
    isUnlocked: (stats) => safeNum(stats?.byGameMode?.more_less?.correct) >= 5,
  },
  {
    id: 'starfish_addition',
    title: 'Starfish Addition Sticker',
    emoji: '⭐',
    description: 'Answer 5 Add Sea Friends questions correctly.',
    isUnlocked: (stats) => safeNum(stats?.byGameMode?.add_sea_friends?.correct) >= 5,
  },
  {
    id: 'koko_bay',
    title: 'Koko Bay Sticker',
    emoji: '🐢',
    description: 'Complete 5 game sessions.',
    isUnlocked: (stats) => safeNum(stats?.completedGames) >= 5,
  },
  {
    id: 'sea_counting_star',
    title: 'Sea Counting Star',
    emoji: '🏅',
    description: 'Answer 25 questions correctly.',
    isUnlocked: (stats) => safeNum(stats?.correct) >= 25,
  },
];

function safeNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Returns the list of sticker items currently unlocked for the given stats. */
export function getUnlockedStickers(stats) {
  if (!stats) return [];
  return STICKER_ITEMS.filter((sticker) => {
    try {
      return Boolean(sticker.isUnlocked(stats));
    } catch (e) {
      return false;
    }
  });
}

/** Returns just the ids of unlocked stickers (used for storage / progress). */
export function getUnlockedStickerIds(stats) {
  return getUnlockedStickers(stats).map((s) => s.id);
}

/** Look up a sticker definition by id (or undefined). */
export function getStickerItem(id) {
  return STICKER_ITEMS.find((s) => s.id === id);
}

export default STICKER_ITEMS;
