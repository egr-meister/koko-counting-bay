import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import KokoMascot from '../components/KokoMascot';
import AppButton from '../components/AppButton';
import StatCard from '../components/StatCard';
import { colors, layout } from '../theme/colors';
import { getGameModeItem, getDifficultyItem } from '../data/gameModeItems';
import { getSessionCompleteAnimationConfig } from '../utils/animationHelpers';
import { playCompleteSoundIfEnabled } from '../utils/soundHelpers';
import { loadAppData } from '../storage/appStorage';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Game Result — calm, encouraging summary after a 5-question session.
 * Reads results from route params (with safe defaults). No penalties, no money.
 */
export default function GameResultScreen({ navigation, route }) {
  const gameMode = route?.params?.gameMode ?? 'count_choose';
  const difficulty = route?.params?.difficulty ?? 'easy';
  const correct = Number(route?.params?.correct);
  const incorrect = Number(route?.params?.incorrect);
  const safeCorrect = Number.isFinite(correct) ? correct : 0;
  const safeIncorrect = Number.isFinite(incorrect) ? incorrect : 0;

  const modeItem = getGameModeItem(gameMode);
  const diffItem = getDifficultyItem(difficulty);

  const [stickerCount, setStickerCount] = React.useState(0);
  const fade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    disableKeepAwakeSafely();
    let active = true;
    loadAppData().then((data) => {
      if (active) setStickerCount(data?.progress?.unlockedStickerIds?.length ?? 0);
      if (active) playCompleteSoundIfEnabled(data?.settings);
    });
    Animated.timing(fade, getSessionCompleteAnimationConfig()).start();
    return () => {
      active = false;
    };
  }, [fade]);

  return (
    <ScreenContainer>
      <Animated.View style={[styles.header, { opacity: fade }]}>
        <KokoMascot size={120} mood="happy" />
        <Text style={styles.title}>Bay counting complete!</Text>
        <Text style={styles.sub}>Well done. You counted lots of sea friends.</Text>
      </Animated.View>

      <View style={styles.statsRow}>
        <StatCard emoji="✅" value={safeCorrect} label="Correct" tint={colors.success} />
        <StatCard emoji="🫧" value={safeIncorrect} label="Incorrect" tint={colors.orange} />
      </View>

      <View style={styles.infoCard}>
        <Row label="Game" value={modeItem?.title ?? 'Game'} />
        <Row label="Difficulty" value={diffItem?.title ?? 'Easy'} />
        <Row label="Sea stickers" value={`${stickerCount} collected`} />
      </View>

      <Text style={styles.progressMsg}>
        Your counting progress and sea stickers are saved on this device.
      </Text>

      <View style={styles.buttons}>
        <AppButton
          label="Play Again"
          variant="primary"
          onPress={() => navigation.replace('CountingGame', { gameMode, difficulty })}
        />
        <View style={{ height: layout.gap }} />
        <AppButton label="Choose Game" variant="secondary" onPress={() => navigation.navigate('GamePicker')} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Sea Stickers" variant="accent" onPress={() => navigation.navigate('SeaSticker')} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
      </View>
    </ScreenContainer>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 26, fontWeight: '900', color: colors.primary, marginTop: 8, textAlign: 'center' },
  sub: { fontSize: 15, color: colors.text, marginTop: 6, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { fontSize: 15, color: colors.mutedText, fontWeight: '700' },
  rowValue: { fontSize: 15, color: colors.text, fontWeight: '800' },
  progressMsg: { fontSize: 13, color: colors.mutedText, textAlign: 'center', marginTop: 12, lineHeight: 19 },
  buttons: { marginTop: 16 },
});
