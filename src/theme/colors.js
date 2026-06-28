/**
 * Koko Sunny Bay color palette.
 * A single bright, calm, child-friendly sea theme.
 * Every value has a safe default at the point of use, but this object is
 * always complete so screens can rely on it.
 */
export const colors = {
  background: '#E7F8FF',
  bayWater: '#A0E7E5',
  softSky: '#BDE0FE',
  sand: '#FFE8A3',
  coral: '#FFADAD',
  shellPink: '#F8C8DC',
  seaGreen: '#70C1B3',
  deepBlue: '#4D96FF',
  card: '#FFFFFF',
  board: '#FFF8EC',
  primary: '#219EBC',
  secondary: '#6C63FF',
  accent: '#FFD166',
  orange: '#F9844A',
  purple: '#9B5DE5',
  text: '#2E3440',
  mutedText: '#7B8794',
  border: '#D6F3F5',
  danger: '#E76F51',
  success: '#52B788',
};

/** Shared spacing + radius tokens for consistent, roomy child-friendly layout. */
export const layout = {
  gap: 12,
  pad: 20,
  radius: 22,
  radiusLg: 30,
  tapMin: 64, // large tap targets for small hands
};

export default colors;
