import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import NumberCard from '../components/NumberCard';
import AppButton from '../components/AppButton';
import { colors, layout } from '../theme/colors';
import { NUMBER_ITEMS } from '../data/numberItems';
import { disableKeepAwakeSafely } from '../utils/immersiveHelpers';

/**
 * Number Bay — teaches the numerals 1–20 with matching sea-object groups.
 * Static learning screen, so keep-awake is never enabled here.
 */
export default function NumberBayScreen({ navigation }) {
  React.useEffect(() => {
    disableKeepAwakeSafely();
  }, []);

  const numbers = Array.isArray(NUMBER_ITEMS) ? NUMBER_ITEMS : [];

  return (
    <ScreenContainer>
      <Text style={styles.title}>Number Bay</Text>
      <Text style={styles.subtitle}>
        Tap to explore numbers 1 to 20. Count the sea friends on each card.
      </Text>

      <View style={styles.grid}>
        {numbers.map((item) => (
          <View key={item.number} style={styles.cell}>
            <NumberCard number={item.number} />
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <AppButton label="Play" variant="primary" onPress={() => navigation.navigate('GamePicker')} />
        <View style={{ height: layout.gap }} />
        <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate('KokoHome')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.text, textAlign: 'center', marginTop: 6, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '48%', marginBottom: layout.gap },
  buttons: { marginTop: 8 },
});
