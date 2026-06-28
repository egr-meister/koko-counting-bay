import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import AppNavigator from './src/navigation/AppNavigator';
import { enableStickyImmersiveMode } from './src/utils/immersiveHelpers';

/**
 * Koko Counting Bay
 * A calm, offline, sea-themed counting app for children.
 *
 * Entry point:
 *  - Provides safe-area context (handles notches / cutouts / rounded corners).
 *  - Hides the Android system bars (sticky immersive, fullscreen).
 *  - Renders the stack navigator with all 7 screens.
 *
 * No internet, no permissions, no accounts. Everything runs locally.
 */
export default function App() {
  React.useEffect(() => {
    // Request fullscreen sticky immersive behavior. Safe no-op if unavailable.
    enableStickyImmersiveMode();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Hide status bar + navigation bar; they reappear briefly on edge swipe. */}
      <SystemBars hidden={true} style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
