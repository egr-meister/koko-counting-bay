/**
 * Gentle sound feedback helpers.
 *
 * This app intentionally ships with NO heavy audio library and requests NO
 * microphone or audio permissions. Sound is treated as an optional, best-effort
 * enhancement: if it is not available, these functions simply do nothing.
 * Visual feedback always carries the real meaning of correct/complete.
 */

function soundEnabled(settings) {
  // Default ON when the setting is missing.
  return settings?.soundEnabled ?? true;
}

/**
 * Play a gentle "correct" cue if sound is enabled.
 * No-op placeholder that never throws — safe in release builds and offline.
 */
export function playCorrectSoundIfEnabled(settings) {
  if (!soundEnabled(settings)) return;
  try {
    // Intentionally silent: no audio library is bundled. Visual feedback is used.
    // A future build could trigger a tiny local tone here without permissions.
  } catch (e) {
    // Never let sound failures affect the learning flow.
  }
}

/**
 * Play a gentle "session complete" cue if sound is enabled.
 * No-op placeholder that never throws.
 */
export function playCompleteSoundIfEnabled(settings) {
  if (!soundEnabled(settings)) return;
  try {
    // Intentionally silent. See note above.
  } catch (e) {
    // Ignore.
  }
}

export default { playCorrectSoundIfEnabled, playCompleteSoundIfEnabled };
