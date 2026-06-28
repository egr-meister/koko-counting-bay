/**
 * Small, crash-proof date helpers. No locale data collection, just display.
 */

/** Current time as an ISO string. */
export function getNowIso() {
  try {
    return new Date().toISOString();
  } catch (e) {
    return '';
  }
}

/** Format an ISO string for friendly display. Returns '' for invalid input. */
export function formatDateTime(isoString) {
  if (!isoString || typeof isoString !== 'string') return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  try {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch (e) {
    return '';
  }
}

export default { getNowIso, formatDateTime };
