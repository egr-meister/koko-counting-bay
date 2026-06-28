import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import SeaStickerBadge from '../components/SeaStickerBadge';
import StatCard from '../components/StatCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import { colors, layout } from '../theme/colors';
import { STICKER_ITEMS } from '../data/stickerItems';
import { getGameModeItem } from '../data/gameModeItems';
import { GAME_MODE_IDS, getTotalAnswered } from '../utils/statsHelpers';
import { loadAppData, resetCountingStats, resetCountingProgress } from '../storage/appStorage';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Sea Sticker album + local statistics.
 * No rankings, no leaderboards, no sharing. Stickers are learning markers only.
 */
export default function SeaStickerScreen({ navigation }) {
  const [data, setData] = React.useState(null);

  const reload = React.useCallback(() => {
    loadAppData().then(setData);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      disableKeepAwakeSafely();
      reload();
    }, [reload])
  );

  const stats = data?.stats;
  const unlockedIds = data?.progress?.unlockedStickerIds ?? [];
  const totalAnswered = getTotalAnswered(stats);
  const hasProgress = totalAnswered > 0 || (stats?.completedGames ?? 0) > 0 || unlockedIds.length > 0;

  function confirmReset() {
    Alert.alert(
      'Reset progress',
      'Are you sure you want to reset Koko counting progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetCountingStats();
            await resetCountingProgress();
            reload();
          },
        },
      ],
      { cancelable: true }
    );
  }

  if (!hasProgress) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Sea Stickers</Text>
        <EmptyState
          title="No sea counting progress yet"
          message="Play a counting game to collect your first sea sticker."
        >
          <AppButton label="Start Counting" variant="primary" onPress={() => navigation.navigate('GamePicker')} />
          <View style={{ height: layout.gap }} />
          <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
        </EmptyState>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Sea Stickers</Text>
      <Text style={styles.subtitle}>Your counting progress and sea sticker album.</Text>

      <View style={styles.statsRow}>
        <StatCard emoji="✅" value={stats?.correct ?? 0} label="Correct" tint={colors.success} />
        <StatCard emoji="🫧" value={stats?.incorrect ?? 0} label="Incorrect" tint={colors.orange} />
        <StatCard emoji="🔢" value={totalAnswered} label="Total answers" tint={colors.primary} />
        <StatCard emoji="🌊" value={stats?.completedGames ?? 0} label="Games done" tint={colors.secondary} />
        <StatCard emoji="🏅" value={unlockedIds.length} label="Stickers" tint={colors.purple} />
      </View>

      <Text style={styles.sectionTitle}>Correct by game</Text>
      <View style={styles.modeCard}>
        {GAME_MODE_IDS.map((id) => {
          const mode = getGameModeItem(id);
          const m = stats?.byGameMode?.[id] ?? { correct: 0, incorrect: 0 };
          return (
            <View key={id} style={styles.modeRow}>
              <Text style={styles.modeName}>{`${mode?.emoji ?? ''} ${mode?.title ?? id}`}</Text>
              <Text style={styles.modeStat}>
                <Text style={{ color: colors.success }}>{m.correct ?? 0} correct</Text>
                {'  ·  '}
                <Text style={{ color: colors.orange }}>{m.incorrect ?? 0} incorrect</Text>
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Sticker album</Text>
      <View style={styles.album}>
        {STICKER_ITEMS.map((sticker) => (
          <SeaStickerBadge
            key={sticker.id}
            sticker={sticker}
            unlocked={unlockedIds.includes(sticker.id)}
          />
        ))}
      </View>

      <Text style={styles.note}>
        Sea stickers are simple learning markers inside the app. They have no money value.
      </Text>

      <View style={styles.buttons}>
        <AppButton label="Reset Progress" variant="danger" onPress={confirmReset} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.text, textAlign: 'center', marginTop: 6, marginBottom: 14 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 14, marginBottom: 10 },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  modeRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  modeName: { fontSize: 15, fontWeight: '800', color: colors.text },
  modeStat: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  album: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  note: { fontSize: 13, color: colors.mutedText, textAlign: 'center', marginTop: 12, lineHeight: 19 },
  buttons: { marginTop: 16 },
});
