import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '../theme/colors';

/**
 * Shared screen wrapper.
 *  - Applies safe-area insets so content never overlaps notches/cutouts/corners.
 *  - Paints the calm bay background with a couple of soft decorative waves.
 *  - Optionally scrolls long content.
 *
 * Props:
 *  - scroll: wrap children in a ScrollView (default true)
 *  - footer: fixed element rendered below the scroll area
 */
export default function ScreenContainer({ children, scroll = true, footer = null, contentStyle }) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: (insets?.top ?? 0) + layout.pad,
    paddingBottom: (insets?.bottom ?? 0) + layout.pad,
    paddingLeft: (insets?.left ?? 0) + layout.pad,
    paddingRight: (insets?.right ?? 0) + layout.pad,
  };

  return (
    <View style={styles.root}>
      {/* Decorative soft waves at the bottom of the bay. */}
      <View pointerEvents="none" style={styles.waveFar} />
      <View pointerEvents="none" style={styles.waveNear} />

      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, pad, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, pad, contentStyle]}>{children}</View>
      )}

      {footer ? (
        <View style={[styles.footer, { paddingBottom: (insets?.bottom ?? 0) + 12 }]}>{footer}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  footer: {
    paddingHorizontal: layout.pad,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  waveFar: {
    position: 'absolute',
    left: -60,
    right: -60,
    bottom: -120,
    height: 320,
    borderTopLeftRadius: 320,
    borderTopRightRadius: 320,
    backgroundColor: colors.softSky,
    opacity: 0.6,
  },
  waveNear: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -160,
    height: 300,
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    backgroundColor: colors.bayWater,
    opacity: 0.55,
  },
});
