import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import SeaObjectGroup from '../components/SeaObjectGroup';
import AnswerBubble from '../components/AnswerBubble';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import KokoMascot from '../components/KokoMascot';
import { colors, layout } from '../theme/colors';
import { buildSession } from '../utils/questionBuilder';
import { isCorrectAnswer } from '../utils/seaCountingHelpers';
import { getGameModeItem, getDifficultyItem } from '../data/gameModeItems';
import { loadAppData, recordLearningAnswer, recordCompletedGame } from '../storage/appStorage';
import { playCorrectSoundIfEnabled } from '../utils/soundHelpers';
import { activateGameKeepAwake, deactivateGameKeepAwake } from '../utils/immersiveHelpers';

const SESSION_LENGTH = 5;
const ENCOURAGEMENT = ['Take your time.', 'Count carefully.', 'Koko can help.'];

/**
 * Counting Game — runs one calm session of 5 questions.
 * No timer, no countdown, no pressure. Keep-awake is active ONLY here.
 */
export default function CountingGameScreen({ navigation, route }) {
  // Validate route params with safe defaults.
  const gameMode = route?.params?.gameMode ?? 'count_choose';
  const difficulty = route?.params?.difficulty ?? 'easy';

  const [questions, setQuestions] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null); // { correct, answerLabel }
  const [correctCount, setCorrectCount] = React.useState(0);
  const [incorrectCount, setIncorrectCount] = React.useState(0);
  const [settings, setSettings] = React.useState(null);
  const lockRef = React.useRef(false);

  // Keep the screen awake only while this game screen is focused.
  useFocusEffect(
    React.useCallback(() => {
      activateGameKeepAwake();
      return () => {
        deactivateGameKeepAwake();
      };
    }, [])
  );

  // Build a fresh session when the screen mounts / params change.
  React.useEffect(() => {
    const session = buildSession(gameMode, difficulty, SESSION_LENGTH);
    setQuestions(Array.isArray(session) ? session : []);
    setIndex(0);
    setSelected(null);
    setFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    lockRef.current = false;
    loadAppData().then((data) => setSettings(data?.settings ?? null));
  }, [gameMode, difficulty]);

  const modeItem = getGameModeItem(gameMode);
  const diffItem = getDifficultyItem(difficulty);
  const question = questions?.[index];
  const total = questions?.length ?? 0;

  // Safe empty state if question data is somehow missing.
  if (!question) {
    return (
      <ScreenContainer>
        <EmptyState
          title="The bay is calm"
          message="We could not set up this game right now. Let's pick a game and try again."
        >
          <AppButton label="Choose Game" variant="primary" onPress={() => navigation.navigate('GamePicker')} />
          <View style={{ height: layout.gap }} />
          <AppButton label="Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
        </EmptyState>
      </ScreenContainer>
    );
  }

  const choices = Array.isArray(question.choices) ? question.choices : [];
  const encourage = ENCOURAGEMENT[index % ENCOURAGEMENT.length];
  const big = difficulty === 'easy';

  async function handleAnswer(value) {
    if (lockRef.current) return;
    lockRef.current = true;
    setSelected(value);

    const correct = isCorrectAnswer(value, question.correctAnswer);
    if (correct) {
      setCorrectCount((c) => c + 1);
      playCorrectSoundIfEnabled(settings);
    } else {
      setIncorrectCount((c) => c + 1);
    }
    setFeedback({ correct, answerLabel: answerToLabel(question, question.correctAnswer) });

    // Persist this answer locally (also updates stickers).
    try {
      await recordLearningAnswer(gameMode, correct);
    } catch (e) {
      // Ignore storage errors; the session still continues.
    }

    // Gentle pause so the child can see the feedback, then advance.
    setTimeout(() => {
      const isLast = index >= total - 1;
      if (isLast) {
        finishSession(correct ? correctCount + 1 : correctCount, correct ? incorrectCount : incorrectCount + 1);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
        lockRef.current = false;
      }
    }, 1100);
  }

  async function finishSession(finalCorrect, finalIncorrect) {
    try {
      await recordCompletedGame();
    } catch (e) {
      // Ignore.
    }
    navigation.replace('GameResult', {
      gameMode,
      difficulty,
      correct: finalCorrect,
      incorrect: finalIncorrect,
      total,
    });
  }

  return (
    <ScreenContainer>
      {/* Header: mode, difficulty, progress (no timer). */}
      <View style={styles.topRow}>
        <Text style={styles.badge}>{modeItem?.title ?? 'Game'}</Text>
        <Text style={styles.badge}>{diffItem?.title ?? 'Easy'}</Text>
      </View>
      <Text style={styles.progress}>{`Question ${index + 1} of ${total}`}</Text>

      <Text style={styles.prompt}>{question.prompt}</Text>

      {/* Visual area depends on the question type. */}
      <View style={styles.visual}>
        {question.visual?.type === 'count' && (
          <SeaObjectGroup
            count={question.visual.count}
            objectType={question.visual.objectType}
            size={big ? 'large' : 'normal'}
          />
        )}

        {question.visual?.type === 'compare' && (
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <Text style={styles.groupLabel}>Left group</Text>
              <SeaObjectGroup count={question.visual.leftCount} objectType={question.visual.objectType} />
            </View>
            <View style={styles.compareCol}>
              <Text style={styles.groupLabel}>Right group</Text>
              <SeaObjectGroup count={question.visual.rightCount} objectType={question.visual.objectType} />
            </View>
          </View>
        )}

        {question.visual?.type === 'addition' && (
          <View style={styles.addRow}>
            <SeaObjectGroup count={question.visual.leftCount} objectType={question.visual.objectType} />
            <Text style={styles.plus}>+</Text>
            <SeaObjectGroup count={question.visual.rightCount} objectType={question.visual.objectType} />
          </View>
        )}
      </View>

      {/* Answer choices */}
      <View style={styles.answers}>
        {choices.map((choice) => (
          <AnswerBubble
            key={String(choice)}
            value={choice}
            label={choiceLabel(question, choice)}
            subLabel={choiceSubLabel(question, choice)}
            disabled={feedback !== null}
            state={bubbleState(feedback, selected, choice, question)}
            onPress={handleAnswer}
          />
        ))}
      </View>

      {/* Feedback / encouragement */}
      <View style={styles.feedbackArea}>
        {feedback ? (
          <View style={styles.feedbackBox}>
            <KokoMascot size={64} mood={feedback.correct ? 'happy' : 'calm'} />
            <Text style={[styles.feedbackText, { color: feedback.correct ? colors.success : colors.primary }]}>
              {feedback.correct ? 'Great counting!' : `Good try. The answer was: ${feedback.answerLabel}`}
            </Text>
          </View>
        ) : (
          <Text style={styles.encourage}>{encourage}</Text>
        )}
      </View>
    </ScreenContainer>
  );
}

/** Big label shown inside an answer bubble. */
function choiceLabel(question, choice) {
  if (question.visual?.type === 'compare') {
    return choice === 'left' ? 'Left' : 'Right';
  }
  return String(choice);
}

/** Small caption under a bubble (used for compare to clarify the choice). */
function choiceSubLabel(question, choice) {
  if (question.visual?.type === 'compare') {
    return 'group';
  }
  return null;
}

/** Human label for the correct answer (used in gentle feedback). */
function answerToLabel(question, value) {
  if (question.visual?.type === 'compare') {
    return value === 'left' ? 'the left group' : 'the right group';
  }
  return String(value);
}

/** Decide the feedback coloring for a given bubble. */
function bubbleState(feedback, selected, choice, question) {
  if (!feedback) return 'idle';
  if (isCorrectAnswer(choice, question.correctAnswer)) return 'correct';
  if (choice === selected) return 'wrong';
  return 'idle';
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: {
    backgroundColor: colors.card,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  progress: { textAlign: 'center', color: colors.mutedText, marginTop: 10, fontSize: 14, fontWeight: '700' },
  prompt: { textAlign: 'center', fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 8, marginBottom: 12 },
  visual: { marginBottom: 8 },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  compareCol: { width: '48%' },
  groupLabel: { textAlign: 'center', fontWeight: '800', color: colors.text, marginBottom: 6 },
  addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  plus: { fontSize: 34, fontWeight: '900', color: colors.primary, marginHorizontal: 10 },
  answers: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 },
  feedbackArea: { minHeight: 96, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  feedbackBox: { alignItems: 'center' },
  feedbackText: { fontSize: 18, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  encourage: { fontSize: 16, color: colors.mutedText, fontStyle: 'italic' },
});
