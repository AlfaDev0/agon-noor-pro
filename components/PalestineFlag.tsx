import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Accurate Palestinian flag (2:1): black / white / green stripes with a red triangle on the hoist (apex at 1/3 of the length). */
export function PalestineFlag({ width = 60, radius = 4, shadow = true }: { width?: number; radius?: number; shadow?: boolean }) {
  const height = width / 2;
  const stripe = height / 3;
  return (
    <View
      style={[
        { width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: '#fff' },
        shadow && styles.shadow,
      ]}
      accessibilityLabel="Flag of Palestine"
    >
      <View style={{ height: stripe, backgroundColor: '#000000' }} />
      <View style={{ height: stripe, backgroundColor: '#FFFFFF' }} />
      <View style={{ height: stripe, backgroundColor: '#009736' }} />
      <View
        style={{
          position: 'absolute', left: 0, top: 0, width: 0, height: 0,
          borderTopWidth: height / 2, borderBottomWidth: height / 2, borderLeftWidth: width / 3,
          borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#EE2A35',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
});
