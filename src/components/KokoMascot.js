import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * Koko the sea turtle — built entirely from rounded React Native Views.
 * No external images. `mood` slightly changes the smile.
 *
 * Props:
 *  - size: overall diameter of the shell (default 96)
 *  - mood: 'happy' | 'calm' (default 'happy')
 */
export default function KokoMascot({ size = 96, mood = 'happy' }) {
  const s = Math.max(48, Number(size) || 96);
  const head = s * 0.62;
  const eye = head * 0.3;
  const pupil = eye * 0.55;

  return (
    <View style={[styles.wrap, { width: s * 1.6, height: s * 1.7 }]}>
      {/* Head */}
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head / 2,
          backgroundColor: colors.seaGreen,
          borderWidth: 3,
          borderColor: '#54A093',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          marginBottom: -head * 0.28,
        }}
      >
        <View style={styles.eyeRow}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={{
                width: eye,
                height: eye,
                borderRadius: eye / 2,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: head * 0.07,
              }}
            >
              <View
                style={{
                  width: pupil,
                  height: pupil,
                  borderRadius: pupil / 2,
                  backgroundColor: colors.text,
                }}
              />
            </View>
          ))}
        </View>
        {/* Smile */}
        <View
          style={{
            width: head * 0.5,
            height: mood === 'happy' ? head * 0.26 : head * 0.16,
            borderBottomLeftRadius: head * 0.3,
            borderBottomRightRadius: head * 0.3,
            borderWidth: 3,
            borderTopWidth: 0,
            borderColor: colors.text,
            marginTop: head * 0.04,
          }}
        />
        {/* Cheeks */}
        <View style={styles.cheekRow} pointerEvents="none">
          <View style={[styles.cheek, { width: head * 0.18, height: head * 0.18, borderRadius: head * 0.09 }]} />
          <View style={{ width: head * 0.34 }} />
          <View style={[styles.cheek, { width: head * 0.18, height: head * 0.18, borderRadius: head * 0.09 }]} />
        </View>
      </View>

      {/* Shell body */}
      <View
        style={{
          width: s,
          height: s,
          borderRadius: s / 2,
          backgroundColor: colors.seaGreen,
          borderWidth: 4,
          borderColor: '#54A093',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={styles.spotRow}>
          <View style={[styles.spot, { width: s * 0.2, height: s * 0.2, borderRadius: s * 0.1 }]} />
          <View style={[styles.spot, { width: s * 0.2, height: s * 0.2, borderRadius: s * 0.1 }]} />
        </View>
        <View style={[styles.spot, { width: s * 0.2, height: s * 0.2, borderRadius: s * 0.1, marginTop: s * 0.06 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'flex-end' },
  eyeRow: { flexDirection: 'row' },
  cheekRow: { flexDirection: 'row', position: 'absolute', bottom: '20%' },
  cheek: { backgroundColor: colors.coral, opacity: 0.85 },
  spotRow: { flexDirection: 'row' },
  spot: { backgroundColor: '#60B2A5', marginHorizontal: 6 },
});
