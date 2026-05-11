// src/utils/performance.js
// Shared performance utilities used across the app.

/**
 * Debounce a function call.
 * Useful for search inputs, resize handlers, etc.
 *
 * @param {Function} fn
 * @param {number} delay  ms
 */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Format a Firestore timestamp safely.
 * Returns empty string on any error instead of crashing.
 *
 * @param {import('firebase/firestore').Timestamp | Date | number | string} ts
 * @param {string} formatStr  — date-fns format string
 * @returns {string}
 */
export async function formatTimestamp(ts, formatStr = 'MMM d, yyyy') {
  try {
    const { format } = await import('date-fns')
    const date = ts?.toDate?.() ?? new Date(ts)
    if (isNaN(date.getTime())) return ''
    return format(date, formatStr)
  } catch {
    return ''
  }
}

/**
 * Truncate a string to maxLength with ellipsis.
 *
 * @param {string} str
 * @param {number} maxLength
 */
export function truncate(str, maxLength = 150) {
  if (!str || str.length <= maxLength) return str ?? ''
  return str.slice(0, maxLength).trimEnd() + '…'
}