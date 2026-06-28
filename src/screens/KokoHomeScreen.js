import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import KokoMascot from '../components/KokoMascot';
import AppButton from '../components/AppButton';
import StatCard from '../components/StatCard';
import { colors, layout } from '../theme/colors';
import { loadAppData } from '../storage/appStorage';
import { getTotalCorrect } from '../utils/statsHelpers';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Home screen — the bright entrance to the bay.
 * Shows a progress preview and the main navigation buttons.
 */
export default function KokoHomeScreen({ navigation }) {
  const [data, setData] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      // Static screen: never hold the device awake here.
      disableKeepAwakeSafely();
      loadAppData().then((loaded) => {
        if (active) setData(loaded);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const stats = data?.stats;
  const correct = getTotalCorrect(stats);
  const completed = stats?.completedGames ?? 0;
  const stickers = data?.progress?.unlockedStickerIds?.length ?? 0;
  const hasProgress = correct > 0 || completed > 0 || stickers > 0;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <KokoMascot size={120} mood="happy" />
        <Text style={styles.title}>Koko Counting Bay</Text>
        <Text style={styles.subtitle}>Count fish, shells, crabs, and sea stars.</Text>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Counting progress</Text>
        {hasProgress ? (
          <View style={styles.statsRow}>
            <StatCard emoji="✅" value={correct} label="Correct answers" tint={colors.success} />
            <StatCard emoji="🌊" value={completed} label="Games completed" tint={colors.primary} />
            <StatCard emoji="🏅" value={stickers} label="Stickers unlocked" tint={colors.orange} />
          </View>
        ) : (
          <Text style={styles.previewEmpty}>
            Visit the bay and count your first sea friend.
          </Text>
        )}
      </View>

      <View style={styles.buttons}>
        <AppButton
          label="Start Counting"
          variant="primary"
          onPress={() => navigation.navigate('GamePicker')}
        />
        <View style={{ height: layout.gap }} />
        <AppButton
          label="Number Bay"
          variant="secondary"
          onPress={() => navigation.navigate('NumberBay')}
        />
        <View style={{ height: layout.gap }} />
        <AppButton
          label="Sea Stickers"
          variant="accent"
          onPress={() => navigation.navigate('SeaSticker')}
        />
        <View style={{ height: layout.gap }} />
        <AppButton
          label="Parent Settings"
          variant="soft"
          onPress={() => navigation.navigate('ParentSettings')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 30, fontWeight: '900', color: colors.primary, marginTop: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.text, marginTop: 6, textAlign: 'center' },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 20,
  },
  previewTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10, textAlign: 'center' },
  previewEmpty: { fontSize: 15, color: colors.mutedText, textAlign: 'center', lineHeight: 21, paddingVertical: 8 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  buttons: { marginTop: 4 },
});
