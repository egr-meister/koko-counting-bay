import React from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import DifficultyChip from '../components/DifficultyChip';
import AppButton from '../components/AppButton';
import { colors, layout } from '../theme/colors';
import { DIFFICULTY_ITEMS } from '../data/gameModeItems';
import { loadAppData, updateSettings, clearAllData } from '../storage/appStorage';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Parent Settings — calm, simple controls plus privacy and safety notes.
 * Static screen: keep-awake is never enabled here.
 */
export default function ParentSettingsScreen({ navigation }) {
  const [settings, setSettings] = React.useState(null);

  const reload = React.useCallback(() => {
    loadAppData().then((data) => setSettings(data?.settings ?? null));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      disableKeepAwakeSafely();
      reload();
    }, [reload])
  );

  const soundEnabled = settings?.soundEnabled ?? true;
  const defaultDifficulty = settings?.defaultDifficulty ?? 'easy';

  async function toggleSound(value) {
    const next = await updateSettings({ soundEnabled: value });
    setSettings(next?.settings ?? null);
  }

  async function chooseDifficulty(id) {
    const next = await updateSettings({ defaultDifficulty: id });
    setSettings(next?.settings ?? null);
  }

  function confirmClearAll() {
    Alert.alert(
      'Clear all data',
      'Are you sure you want to delete all local Koko counting progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const next = await clearAllData();
            setSettings(next?.settings ?? null);
          },
        },
      ],
      { cancelable: true }
    );
  }

  const difficulties = Array.isArray(DIFFICULTY_ITEMS) ? DIFFICULTY_ITEMS : [];

  return (
    <ScreenContainer>
      <Text style={styles.title}>Parent Settings</Text>

      {/* Sound */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Sound</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ true: colors.seaGreen, false: colors.border }}
            thumbColor={'#FFFFFF'}
          />
        </View>
        <Text style={styles.cardText}>
          Gentle correct-answer sounds can be turned off anytime.
        </Text>
      </View>

      {/* Default difficulty */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Default Difficulty</Text>
        <View style={styles.chips}>
          {difficulties.map((item) => (
            <DifficultyChip
              key={item.id}
              item={item}
              selected={defaultDifficulty === item.id}
              onPress={() => chooseDifficulty(item.id)}
            />
          ))}
        </View>
      </View>

      {/* Session length */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session Length</Text>
        <Text style={styles.cardText}>Each game session has 5 calm questions.</Text>
      </View>

      {/* Theme */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Theme</Text>
        <Text style={styles.cardText}>Koko Counting Bay uses a bright child-friendly sea theme.</Text>
      </View>

      {/* Sticker progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sticker Progress</Text>
        <Text style={styles.cardText}>
          Sea stickers are simple learning markers inside the app. They have no money value.
        </Text>
      </View>

      {/* Privacy */}
      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.cardTitle}>Privacy Note</Text>
        <Text style={styles.cardText}>
          Koko Counting Bay does not collect personal data. The app works offline and stores
          learning progress, stickers, statistics, and settings only on this device.
        </Text>
      </View>

      {/* Child-friendly */}
      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.cardTitle}>Child-Friendly Note</Text>
        <Text style={styles.cardText}>
          There are no ads, purchases, accounts, internet access, social sharing, leaderboards,
          coins, bonuses, jackpots, or real money rewards.
        </Text>
      </View>

      {/* Clear all data */}
      <View style={styles.buttons}>
        <AppButton label="Clear All Data" variant="danger" onPress={confirmClearAll} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, textAlign: 'center', marginBottom: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: layout.gap,
  },
  infoCard: { backgroundColor: colors.board, borderColor: colors.sand },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  cardText: { fontSize: 14, color: colors.mutedText, marginTop: 8, lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  buttons: { marginTop: 8, marginBottom: 12 },
});
