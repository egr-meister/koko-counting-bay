import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * Pill-shaped difficulty selector chip.
 *
 * Props:
 *  - item: { id, title, emoji }
 *  - selected: boolean
 *  - onPress: handler
 */
export default function DifficultyChip({ item, selected = false, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={styles.emoji}>{item?.emoji ?? '🌊'}</Text>
      <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.text }]}>
        {item?.title ?? 'Easy'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 26,
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 10,
  },
  emoji: { fontSize: 18, marginRight: 8 },
  label: { fontSize: 16, fontWeight: '800' },
});
