/**
 * Learning statistics helpers. All functions are pure and never throw or
 * return NaN. Missing/partial input is merged with defaults.
 */
export const GAME_MODE_IDS = ['count_choose', 'more_less', 'add_sea_friends'];

function emptyModeStat() {
  return { correct: 0, incorrect: 0 };
}

/** A fresh, complete stats object with all counters at zero. */
export function createDefaultStats() {
  return {
    correct: 0,
    incorrect: 0,
    completedGames: 0,
    byGameMode: {
      count_choose: emptyModeStat(),
      more_less: emptyModeStat(),
      add_sea_friends: emptyModeStat(),
    },
  };
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

/** Deep-merge stored stats onto defaults so the shape is always complete. */
export function mergeStats(stored) {
  const base = createDefaultStats();
  if (!stored || typeof stored !== 'object') return base;
  base.correct = num(stored.correct);
  base.incorrect = num(stored.incorrect);
  base.completedGames = num(stored.completedGames);
  const sm = stored.byGameMode || {};
  GAME_MODE_IDS.forEach((id) => {
    base.byGameMode[id] = {
      correct: num(sm?.[id]?.correct),
      incorrect: num(sm?.[id]?.incorrect),
    };
  });
  return base;
}

/** Record a single answer, returning a new stats object. */
export function recordAnswer(stats, gameMode, isCorrect) {
  const next = mergeStats(stats);
  const mode = GAME_MODE_IDS.includes(gameMode) ? gameMode : 'count_choose';
  if (isCorrect) {
    next.correct += 1;
    next.byGameMode[mode].correct += 1;
  } else {
    next.incorrect += 1;
    next.byGameMode[mode].incorrect += 1;
  }
  return next;
}

/** Record one completed game session, returning a new stats object. */
export function recordCompletedGame(stats) {
  const next = mergeStats(stats);
  next.completedGames += 1;
  return next;
}

export function getTotalCorrect(stats) {
  return num(mergeStats(stats).correct);
}

export function getTotalIncorrect(stats) {
  return num(mergeStats(stats).incorrect);
}

export function getTotalAnswered(stats) {
  const s = mergeStats(stats);
  return s.correct + s.incorrect;
}

/** Returns fresh default stats (used when resetting progress). */
export function resetStats() {
  return createDefaultStats();
}

export default createDefaultStats;
