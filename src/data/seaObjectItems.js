/**
 * Sea object catalogue for Koko Counting Bay.
 * Friendly, calm creatures only. No scary or deep-sea creatures.
 */
export const SEA_OBJECT_ITEMS = [
  { id: 'fish', label: 'Fish', emoji: '🐟', singular: 'fish', plural: 'fish' },
  { id: 'shell', label: 'Shell', emoji: '🐚', singular: 'shell', plural: 'shells' },
  { id: 'crab', label: 'Crab', emoji: '🦀', singular: 'crab', plural: 'crabs' },
  { id: 'sea_star', label: 'Sea Star', emoji: '⭐', singular: 'sea star', plural: 'sea stars' },
];

const FALLBACK_OBJECT = SEA_OBJECT_ITEMS[0];

/** Returns the sea object item for an id, falling back to Fish for invalid input. */
export function getSeaObjectItem(objectType) {
  if (!objectType || typeof objectType !== 'string') return FALLBACK_OBJECT;
  const found = SEA_OBJECT_ITEMS.find((item) => item.id === objectType);
  return found || FALLBACK_OBJECT;
}

/**
 * Sea objects available for a difficulty.
 * Easy uses a single object type for clarity; Medium/Hard use the full mix.
 */
export function getSeaObjectsForDifficulty(difficulty) {
  if (difficulty === 'easy') {
    return [SEA_OBJECT_ITEMS[0]];
  }
  return SEA_OBJECT_ITEMS;
}

export default SEA_OBJECT_ITEMS;
