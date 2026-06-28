/**
 * Number catalogue for the Number Bay (1–20).
 * Each number is paired with a friendly sea object so children can connect
 * the numeral with a quantity of something they can count.
 */
import { SEA_OBJECT_ITEMS } from './seaObjectItems';

function buildNumberItems() {
  const items = [];
  for (let n = 1; n <= 20; n += 1) {
    const object = SEA_OBJECT_ITEMS[(n - 1) % SEA_OBJECT_ITEMS.length];
    const word = n === 1 ? object.singular : object.plural;
    items.push({
      number: n,
      objectType: object.id,
      emoji: object.emoji,
      label: `${numberWord(n)} ${word}`,
    });
  }
  return items;
}

const WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

/** Spelled-out word for a number 0–20, safe for out-of-range input. */
export function numberWord(n) {
  const idx = Math.round(Number(n));
  if (!Number.isFinite(idx) || idx < 0 || idx >= WORDS.length) return String(n);
  return WORDS[idx];
}

export const NUMBER_ITEMS = buildNumberItems();

const FALLBACK_ITEM = NUMBER_ITEMS[0];

/** Returns the number item for a value 1–20, falling back to 1 when invalid. */
export function getNumberItem(number) {
  const n = Math.round(Number(number));
  if (!Number.isFinite(n)) return FALLBACK_ITEM;
  const found = NUMBER_ITEMS.find((item) => item.number === n);
  return found || FALLBACK_ITEM;
}

/** Max number allowed for a difficulty (counting / comparison range). */
export function getMaxNumberForDifficulty(difficulty) {
  switch (difficulty) {
    case 'hard':
      return 20;
    case 'medium':
      return 10;
    case 'easy':
    default:
      return 5;
  }
}

/** Ordered list of numbers (1..max) available for a difficulty. */
export function getNumbersForDifficulty(difficulty) {
  const max = getMaxNumberForDifficulty(difficulty);
  const list = [];
  for (let n = 1; n <= max; n += 1) list.push(n);
  return list;
}

export default NUMBER_ITEMS;
