import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';
import { getSeaObjectItem } from '../data/seaObjectItems';
import { createSeaObjectGroup } from '../utils/seaCountingHelpers';

/**
 * Renders a clear, countable group of one sea object as emoji cells inside a
 * soft sand panel. Easy difficulty uses bigger cells for very clear groups.
 *
 * Props:
 *  - count: how many objects (0..20)
 *  - objectType: 'fish' | 'shell' | 'crab' | 'sea_star'
 *  - size: 'large' | 'normal' (default 'normal')
 *  - tint: optional panel background override
 */
export default function SeaObjectGroup({ count = 0, objectType = 'fish', size = 'normal', tint }) {
  const group = createSeaObjectGroup(count, objectType);
  const item = getSeaObjectItem(objectType);
  const big = size === 'large';
  const cellSize = big ? 56 : 40;
  const fontSize = big ? 40 : 28;

  return (
    <View style={[styles.panel, tint ? { backgroundColor: tint } : null]}>
      {group.count === 0 ? (
        <Text style={styles.empty}>No {item.plural} here yet</Text>
      ) : (
        <View style={styles.grid}>
          {group.cells.map((cell) => (
            <View key={cell.key} style={[styles.cell, { width: cellSize, height: cellSize }]}>
              <Text style={{ fontSize }} accessibilityLabel={item.singular}>
                {cell.emoji}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.board,
    borderRadius: layout.radius,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.sand,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  cell: { alignItems: 'center', justifyContent: 'center', margin: 3 },
  empty: { color: colors.mutedText, fontSize: 14 },
});
