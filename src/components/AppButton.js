import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

/**
 * Large, rounded, child-friendly button with a big tap target.
 *
 * Props:
 *  - label: button text
 *  - onPress: handler
 *  - variant: 'primary' | 'secondary' | 'accent' | 'soft' | 'danger'
 *  - disabled: boolean
 */
const VARIANT_BG = {
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  soft: colors.card,
  danger: colors.danger,
};
const VARIANT_TEXT = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  accent: colors.text,
  soft: colors.primary,
  danger: '#FFFFFF',
};

export default function AppButton({ label, onPress, variant = 'primary', disabled = false, style }) {
  const bg = VARIANT_BG[variant] ?? colors.primary;
  const fg = VARIANT_TEXT[variant] ?? '#FFFFFF';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          borderWidth: variant === 'soft' ? 2 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: layout.tapMin,
    borderRadius: layout.radiusLg,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: { fontSize: 20, fontWeight: '800' },
});
