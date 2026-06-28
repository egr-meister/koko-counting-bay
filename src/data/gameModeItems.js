/**
 * Game modes and difficulty levels for Koko Counting Bay.
 * All wording is calm and child-friendly. No timers, no pressure.
 */
export const GAME_MODE_ITEMS = [
  {
    id: 'count_choose',
    title: 'Count and Choose',
    description: 'Count sea objects and choose the number.',
    emoji: '🐟',
    accentKey: 'primary',
  },
  {
    id: 'more_less',
    title: 'More or Less',
    description: 'Choose which group has more or less.',
    emoji: '🦀',
    accentKey: 'orange',
  },
  {
    id: 'add_sea_friends',
    title: 'Add Sea Friends',
    description: 'Add simple sea objects together.',
    emoji: '⭐',
    accentKey: 'purple',
  },
];

export const DIFFICULTY_ITEMS = [
  { id: 'easy', title: 'Easy', description: 'Numbers 1–5, 2 choices, big groups.', emoji: '🫧' },
  { id: 'medium', title: 'Medium', description: 'Numbers 1–10, 3 choices, mixed sea friends.', emoji: '🌊' },
  { id: 'hard', title: 'Hard', description: 'Numbers 1–20, 4 choices, more to count.', emoji: '🐢' },
];

const FALLBACK_MODE = GAME_MODE_ITEMS[0];
const FALLBACK_DIFFICULTY = DIFFICULTY_ITEMS[0];

/** Game mode item, falling back to Count and Choose for invalid input. */
export function getGameModeItem(gameMode) {
  if (!gameMode || typeof gameMode !== 'string') return FALLBACK_MODE;
  return GAME_MODE_ITEMS.find((m) => m.id === gameMode) || FALLBACK_MODE;
}

/** Difficulty item, falling back to Easy for invalid input. */
export function getDifficultyItem(difficulty) {
  if (!difficulty || typeof difficulty !== 'string') return FALLBACK_DIFFICULTY;
  return DIFFICULTY_ITEMS.find((d) => d.id === difficulty) || FALLBACK_DIFFICULTY;
}

export default GAME_MODE_ITEMS;
