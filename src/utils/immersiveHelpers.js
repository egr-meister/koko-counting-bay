/**
 * Fullscreen / keep-awake helpers.
 *
 * - Fullscreen sticky immersive: hide the Android status + navigation bars.
 *   App.js renders <SystemBars hidden /> declaratively; this helper offers an
 *   imperative request as well and is a safe no-op if the API is unavailable.
 * - Keep awake: enabled ONLY on the active counting game screen, and always
 *   released when leaving it, so static screens never hold the screen on.
 *
 * Everything is wrapped so a missing or platform-specific API can never crash.
 */
import { Platform } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

const KEEP_AWAKE_TAG = 'koko-counting-game';

/** Request fullscreen sticky immersive mode (hide system bars). Safe no-op otherwise. */
export function enableStickyImmersiveMode() {
  if (Platform.OS !== 'android') return;
  try {
    // react-native-edge-to-edge exposes an imperative SystemBars controller.
    // Use it defensively; the declarative <SystemBars hidden /> in App.js is the
    // primary mechanism, so failures here are harmless.
    // eslint-disable-next-line global-require
    const edge = require('react-native-edge-to-edge');
    if (edge?.SystemBars?.setHidden) {
      edge.SystemBars.setHidden(true);
    }
  } catch (e) {
    // No-op: declarative SystemBars still applies.
  }
}

/** Turn on keep-awake for the active game screen. Best-effort. */
export function activateGameKeepAwake() {
  try {
    activateKeepAwakeAsync(KEEP_AWAKE_TAG);
  } catch (e) {
    // Ignore — keeping the screen awake is a convenience, not a requirement.
  }
}

/** Release the game keep-awake lock. */
export function deactivateGameKeepAwake() {
  try {
    deactivateKeepAwake(KEEP_AWAKE_TAG);
  } catch (e) {
    // Ignore.
  }
}

/** Alias used when leaving any non-game screen, to be safe. */
export function disableKeepAwakeSafely() {
  deactivateGameKeepAwake();
}

export default {
  enableStickyImmersiveMode,
  activateGameKeepAwake,
  deactivateGameKeepAwake,
  disableKeepAwakeSafely,
};
