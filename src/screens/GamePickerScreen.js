import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import GameModeCard from '../components/GameModeCard';
import DifficultyChip from '../components/DifficultyChip';
import AppButton from '../components/AppButton';
import { colors, layout } from '../theme/colors';
import { GAME_MODE_ITEMS, DIFFICULTY_ITEMS } from '../data/gameModeItems';
import { loadAppData } from '../storage/appStorage';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Game Picker — choose a game mode and a difficulty, then start.
 * Validates that both are chosen before starting (kind, non-blocking messages).
 */
export default function GamePickerScreen({ navigation }) {
  const [gameMode, setGameMode] = React.useState(null);
  const [difficulty, setDifficulty] = React.useState(null);
  const [message, setMessage] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      disableKeepAwakeSafely();
      // Pre-select the parent's default difficulty for convenience.
      loadAppData().then((data) => {
        if (active && !difficulty) {
          setDifficulty(data?.settings?.defaultDifficulty ?? 'easy');
        }
      });
      return () => {
        active = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const modes = Array.isArray(GAME_MODE_ITEMS) ? GAME_MODE_ITEMS : [];
  const difficulties = Array.isArray(DIFFICULTY_ITEMS) ? DIFFICULTY_ITEMS : [];

  function handleStart() {
    if (!gameMode) {
      setMessage('Please choose a game.');
      return;
    }
    if (!difficulty) {
      setMessage('Please choose a difficulty.');
      return;
    }
    setMessage('');
    navigation.navigate('CountingGame', { gameMode, difficulty });
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Choose a Game</Text>
      <Text style={styles.subtitle}>Pick a game and a difficulty. Take your time.</Text>

      {modes.map((mode) => (
        <GameModeCard
          key={mode.id}
          mode={mode}
          selected={gameMode === mode.id}
          onPress={() => {
            setGameMode(mode.id);
            setMessage('');
          }}
        />
      ))}

      <Text style={styles.sectionTitle}>Difficulty</Text>
      <View style={styles.chips}>
        {difficulties.map((item) => (
          <DifficultyChip
            key={item.id}
            item={item}
            selected={difficulty === item.id}
            onPress={() => {
              setDifficulty(item.id);
              setMessage('');
            }}
          />
        ))}
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.buttons}>
        <AppButton label="Start Game" variant="primary" onPress={handleStart} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Back" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.text, textAlign: 'center', marginTop: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 8, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  message: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
    textAlign: 'center',
    marginTop: 8,
  },
  buttons: { marginTop: 16 },
});
