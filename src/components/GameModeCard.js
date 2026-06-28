import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * Selectable card describing a game mode.
 *
 * Props:
 *  - mode: { id, title, description, emoji, accentKey }
 *  - selected: boolean
 *  - onPress: handler
 */
export default function GameModeCard({ mode, selected = false, onPress }) {
  const accent = colors[mode?.accentKey] ?? colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: selected ? accent : colors.border, opacity: pressed ? 0.9 : 1 },
        selected && { backgroundColor: '#FFFFFF' },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: selected ? accent : colors.board }]}>
        <Text style={styles.emoji}>{mode?.emoji ?? '🐟'}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{mode?.title ?? 'Game'}</Text>
        <Text style={styles.desc}>{mode?.description ?? ''}</Text>
      </View>
      <View style={[styles.check, { borderColor: selected ? accent : colors.border }]}>
        {selected ? <View style={[styles.checkDot, { backgroundColor: accent }]} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 14,
    borderWidth: 3,
    marginBottom: layout.gap,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 28 },
  textWrap: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  desc: { fontSize: 13, color: colors.mutedText, marginTop: 2 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkDot: { width: 12, height: 12, borderRadius: 6 },
});
