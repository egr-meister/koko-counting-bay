import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';
import KokoMascot from './KokoMascot';

/**
 * Friendly empty / fallback state with Koko and a calm message.
 * Used when there is no progress yet, or when expected data is missing
 * (so the app shows something kind instead of crashing).
 *
 * Props:
 *  - title: headline
 *  - message: supporting text
 *  - children: optional action(s)
 */
export default function EmptyState({ title = 'Nothing here yet', message = '', children }) {
  return (
    <View style={styles.wrap}>
      <KokoMascot size={88} mood="calm" />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.pad,
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 12, textAlign: 'center' },
  message: { fontSize: 15, color: colors.mutedText, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  actions: { marginTop: 16, alignSelf: 'stretch' },
});
