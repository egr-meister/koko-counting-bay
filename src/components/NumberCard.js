import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';
import { getNumberItem, numberWord } from '../data/numberItems';
import SeaObjectGroup from './SeaObjectGroup';

/**
 * A floating-bubble number card used in the Number Bay.
 * Shows the numeral, a matching group of sea objects, and a short label.
 *
 * Props:
 *  - number: 1..20
 *  - onPress: optional handler
 */
export default function NumberCard({ number = 1, onPress }) {
  const item = getNumberItem(number);
  const n = item?.number ?? 1;

  const Inner = (
    <View style={styles.card}>
      <View style={styles.bubble}>
        <Text style={styles.numeral}>{n}</Text>
      </View>
      <SeaObjectGroup count={n} objectType={item?.objectType ?? 'fish'} />
      <Text style={styles.label}>{`${numberWord(n)} ${n === 1 ? 'object' : 'objects'}`}</Text>
      <Text style={styles.sub}>{item?.label ?? ''}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {Inner}
      </Pressable>
    );
  }
  return Inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.softSky,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  numeral: { fontSize: 36, fontWeight: '900', color: colors.primary },
  label: { marginTop: 10, fontSize: 16, fontWeight: '700', color: colors.text },
  sub: { marginTop: 2, fontSize: 13, color: colors.mutedText },
});
