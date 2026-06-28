/**
 * Builds one calm counting question at a time.
 *
 * Guarantees enforced everywhere:
 *  - choices always include the correct answer
 *  - choices never contain duplicates
 *  - Easy = 2 choices, Medium = 3, Hard = 4
 *  - addition results are always <= 10
 *  - more/less groups are never equal
 *  - no timers, no pressure, no negative mechanics
 */
import {
  getChoiceCountForDifficulty,
  getNumberRangeForDifficulty,
  createNumberChoices,
  randomInt,
  shuffleArray,
} from './seaCountingHelpers';
import { getSeaObjectsForDifficulty, getSeaObjectItem } from '../data/seaObjectItems';
import { getMaxNumberForDifficulty } from '../data/numberItems';

let questionCounter = 0;
function nextId(prefix) {
  questionCounter += 1;
  return `${prefix}_${Date.now()}_${questionCounter}`;
}

function normalizeDifficulty(difficulty) {
  return ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'easy';
}

function pickObjectType(difficulty) {
  const objects = getSeaObjectsForDifficulty(difficulty);
  const safe = Array.isArray(objects) && objects.length ? objects : [getSeaObjectItem('fish')];
  return safe[randomInt(0, safe.length - 1)].id;
}

/** Count and Choose: show N objects, choose the matching number. */
export function buildCountChooseQuestion(difficulty) {
  const diff = normalizeDifficulty(difficulty);
  const { min, max } = getNumberRangeForDifficulty(diff);
  const objectType = pickObjectType(diff);
  const count = randomInt(Math.max(1, min), max);
  const item = getSeaObjectItem(objectType);
  const prompts = [
    `How many ${item.plural}?`,
    `Count the ${item.plural}.`,
  ];
  return {
    id: nextId('count'),
    gameMode: 'count_choose',
    difficulty: diff,
    prompt: prompts[randomInt(0, prompts.length - 1)],
    correctAnswer: count,
    choices: createNumberChoices(count, diff, max),
    visual: { type: 'count', objectType, count },
  };
}

/** More or Less: two unequal groups; pick which has more (or less). */
export function buildMoreLessQuestion(difficulty) {
  const diff = normalizeDifficulty(difficulty);
  const max = getMaxNumberForDifficulty(diff);
  const objectType = pickObjectType(diff);

  let leftCount = randomInt(1, max);
  let rightCount = randomInt(1, max);
  // Groups must never be equal.
  let guard = 0;
  while (rightCount === leftCount && guard < 50) {
    rightCount = randomInt(1, max);
    guard += 1;
  }
  if (rightCount === leftCount) {
    // Final safety net: force a difference within range.
    rightCount = leftCount < max ? leftCount + 1 : leftCount - 1;
  }

  const compareType = Math.random() < 0.5 ? 'more' : 'less';
  let correctAnswer;
  if (compareType === 'more') {
    correctAnswer = leftCount > rightCount ? 'left' : 'right';
  } else {
    correctAnswer = leftCount < rightCount ? 'left' : 'right';
  }

  return {
    id: nextId('compare'),
    gameMode: 'more_less',
    difficulty: diff,
    prompt: compareType === 'more' ? 'Which group has more?' : 'Which group has less?',
    correctAnswer,
    choices: ['left', 'right'],
    visual: { type: 'compare', objectType, leftCount, rightCount, compareType },
  };
}

/** Add Sea Friends: two small groups, sum always <= 10. */
export function buildAdditionQuestion(difficulty) {
  const diff = normalizeDifficulty(difficulty);
  const objectType = pickObjectType(diff);

  // Easy keeps both parts very small; result always limited to 10.
  const partMax = diff === 'easy' ? 3 : 5;
  let leftCount = randomInt(1, partMax);
  let rightCount = randomInt(1, partMax);
  if (leftCount + rightCount > 10) {
    // Re-balance so the sum never exceeds 10.
    rightCount = Math.max(1, 10 - leftCount);
  }
  const sum = leftCount + rightCount;
  const item = getSeaObjectItem(objectType);
  const prompts = [
    `Add the ${item.plural}.`,
    'How many sea friends together?',
    'Count both groups.',
  ];

  return {
    id: nextId('add'),
    gameMode: 'add_sea_friends',
    difficulty: diff,
    prompt: prompts[randomInt(0, prompts.length - 1)],
    correctAnswer: sum,
    // Addition choices are bounded to the 1..10 result space.
    choices: createNumberChoices(sum, diff, 10),
    visual: { type: 'addition', objectType, leftCount, rightCount },
  };
}

/** Build any question by game mode. Falls back safely to Count and Choose. */
export function buildCountingQuestion(gameMode, difficulty) {
  switch (gameMode) {
    case 'more_less':
      return buildMoreLessQuestion(difficulty);
    case 'add_sea_friends':
      return buildAdditionQuestion(difficulty);
    case 'count_choose':
    default:
      return buildCountChooseQuestion(difficulty);
  }
}

/** Build a full session of N questions (defaults to 5). */
export function buildSession(gameMode, difficulty, length = 5) {
  let n = Math.round(Number(length));
  if (!Number.isFinite(n) || n < 1) n = 5;
  const questions = [];
  for (let i = 0; i < n; i += 1) {
    questions.push(buildCountingQuestion(gameMode, difficulty));
  }
  return questions;
}

export default buildCountingQuestion;
