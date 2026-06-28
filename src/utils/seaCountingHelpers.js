/**
 * Pure helpers for building safe, child-friendly counting questions.
 * Every function guards against invalid input and never returns NaN.
 */
import { getMaxNumberForDifficulty } from '../data/numberItems';
import { getSeaObjectItem } from '../data/seaObjectItems';

/** Number of answer choices per difficulty. Easy 2, Medium 3, Hard 4. */
export function getChoiceCountForDifficulty(difficulty) {
  switch (difficulty) {
    case 'hard':
      return 4;
    case 'medium':
      return 3;
    case 'easy':
    default:
      return 2;
  }
}

/** Inclusive [min, max] number range for a difficulty. */
export function getNumberRangeForDifficulty(difficulty) {
  return { min: 1, max: getMaxNumberForDifficulty(difficulty) };
}

/** Random integer in [min, max] inclusive. Safe for swapped/invalid bounds. */
export function randomInt(min, max) {
  let lo = Math.round(Number(min));
  let hi = Math.round(Number(max));
  if (!Number.isFinite(lo)) lo = 1;
  if (!Number.isFinite(hi)) hi = 1;
  if (hi < lo) {
    const t = lo;
    lo = hi;
    hi = t;
  }
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Fisher–Yates shuffle returning a new array. Safe for non-arrays. */
export function shuffleArray(items) {
  if (!Array.isArray(items)) return [];
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

/**
 * Build a set of unique numeric answer choices that always includes the
 * correct answer. Never produces duplicates or NaN.
 */
export function createNumberChoices(correctAnswer, difficulty, maxValue) {
  const count = getChoiceCountForDifficulty(difficulty);
  let correct = Math.round(Number(correctAnswer));
  if (!Number.isFinite(correct)) correct = 1;

  let max = Math.round(Number(maxValue));
  if (!Number.isFinite(max) || max < 1) {
    max = getMaxNumberForDifficulty(difficulty);
  }
  // Ensure the range can hold the correct answer.
  if (correct > max) max = correct;
  const min = 1;

  const choices = new Set([correct]);
  let guard = 0;
  while (choices.size < count && guard < 200) {
    guard += 1;
    choices.add(randomInt(min, Math.max(max, count)));
  }
  // If the range was too small to reach `count`, extend upward safely.
  let extra = max + 1;
  while (choices.size < count) {
    choices.add(extra);
    extra += 1;
  }
  return shuffleArray(Array.from(choices)).slice(0, count);
}

/**
 * Build a visual group descriptor: a list of identical sea-object cells.
 * Used by SeaObjectGroup to render `count` copies of one creature.
 */
export function createSeaObjectGroup(count, objectType) {
  const item = getSeaObjectItem(objectType);
  let n = Math.round(Number(count));
  if (!Number.isFinite(n) || n < 0) n = 0;
  if (n > 20) n = 20;
  const cells = [];
  for (let i = 0; i < n; i += 1) {
    cells.push({ key: `${item.id}_${i}`, emoji: item.emoji });
  }
  return { objectType: item.id, emoji: item.emoji, count: n, cells };
}

/** Strict equality check that tolerates string/number mismatches. */
export function isCorrectAnswer(selectedValue, correctValue) {
  if (selectedValue === undefined || selectedValue === null) return false;
  if (typeof correctValue === 'number') {
    return Number(selectedValue) === correctValue;
  }
  return String(selectedValue) === String(correctValue);
}

export default {
  getChoiceCountForDifficulty,
  getNumberRangeForDifficulty,
  createNumberChoices,
  createSeaObjectGroup,
  shuffleArray,
  isCorrectAnswer,
};
