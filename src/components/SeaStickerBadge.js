import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * A single sea sticker badge for the album.
 * Stickers are local learning markers only — no money value.
 *
 * Props:
 *  - sticker: { title, emoji, description }
 *  - unlocked: boolean
 */
export default function SeaStickerBadge({ sticker, unlocked = false }) {
  return (
    <View style={[styles.card, { opacity: unlocked ? 1 : 0.55 }]}>
      <View style={[styles.badge, { backgroundColor: unlocked ? colors.accent : colors.border }]}>
        <Text style={styles.emoji}>{unlocked ? (sticker?.emoji ?? '🏅') : '🔒'}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {sticker?.title ?? 'Sticker'}
      </Text>
      <Text style={styles.desc} numberOfLines={3}>
        {sticker?.description ?? ''}
      </Text>
      <Text style={[styles.status, { color: unlocked ? colors.success : colors.mutedText }]}>
        {unlocked ? 'Collected' : 'Keep counting'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: 14,
    margin: '1.5%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: { fontSize: 30 },
  title: { fontSize: 14, fontWeight: '800', color: colors.text, textAlign: 'center' },
  desc: { fontSize: 11, color: colors.mutedText, textAlign: 'center', marginTop: 4, minHeight: 30 },
  status: { fontSize: 12, fontWeight: '800', marginTop: 6 },
});
