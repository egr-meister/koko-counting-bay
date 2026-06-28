import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * Large rounded answer bubble.
 *
 * Props:
 *  - label: text shown (number or word)
 *  - onPress: handler(value)
 *  - value: value passed back on press
 *  - state: 'idle' | 'correct' | 'wrong' (for gentle feedback coloring)
 *  - disabled: boolean
 *  - subLabel: small caption under the label (optional)
 */
export default function AnswerBubble({ label, onPress, value, state = 'idle', disabled = false, subLabel }) {
  const bg =
    state === 'correct' ? colors.success : state === 'wrong' ? colors.coral : colors.card;
  const fg = state === 'correct' || state === 'wrong' ? '#FFFFFF' : colors.primary;
  const border =
    state === 'correct' ? colors.success : state === 'wrong' ? colors.danger : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={String(label)}
      disabled={disabled}
      onPress={() => onPress && onPress(value)}
      style={({ pressed }) => [
        styles.bubble,
        { backgroundColor: bg, borderColor: border, opacity: pressed && !disabled ? 0.9 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
      {subLabel ? (
        <View>
          <Text style={[styles.sub, { color: fg }]} numberOfLines={1}>
            {subLabel}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    minWidth: 96,
    minHeight: layout.tapMin + 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    margin: 8,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: { fontSize: 30, fontWeight: '900' },
  sub: { fontSize: 13, fontWeight: '700', marginTop: 2 },
});
