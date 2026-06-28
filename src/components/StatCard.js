import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * Small rounded card showing one statistic.
 *
 * Props:
 *  - emoji: leading icon
 *  - value: number/string to display big
 *  - label: caption
 *  - tint: optional accent color for the value
 */
export default function StatCard({ emoji = '🫧', value = 0, label = '', tint }) {
  const display = value === undefined || value === null ? 0 : value;
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, tint ? { color: tint } : null]}>{String(display)}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    flexGrow: 1,
    flexBasis: '30%',
    margin: 4,
    minWidth: 92,
  },
  emoji: { fontSize: 22 },
  value: { fontSize: 26, fontWeight: '900', color: colors.primary, marginTop: 4 },
  label: { fontSize: 12, color: colors.mutedText, marginTop: 2, textAlign: 'center' },
});
