/**
 * Simple, calm React Native Animated configs.
 * No heavy libraries, no flashing, no stressful motion. All values are gentle
 * and safe to run in release (Hermes) builds.
 */
import { Easing } from 'react-native';

/** A soft pop used when an answer is correct. */
export function getCorrectAnswerAnimationConfig() {
  return {
    toValue: 1,
    duration: 280,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  };
}

/** A gentle settle used on the result/session-complete screen. */
export function getSessionCompleteAnimationConfig() {
  return {
    toValue: 1,
    duration: 420,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  };
}

/** A slow, friendly reveal used when a sticker unlocks. */
export function getStickerUnlockAnimationConfig() {
  return {
    toValue: 1,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  };
}

export default {
  getCorrectAnswerAnimationConfig,
  getSessionCompleteAnimationConfig,
  getStickerUnlockAnimationConfig,
};
