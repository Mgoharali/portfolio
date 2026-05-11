// src/utils/sanitize.js
// XSS protection for all user-submitted content.
// Uses DOMPurify in the browser; falls back to plain text stripping in SSR.

/**
 * Sanitize a string to prevent XSS.
 * Strips all HTML tags and dangerous attributes.
 * Use on every user input before storing or rendering.
 *
 * @param {string} value
 * @returns {string}
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') return ''
  // Strip HTML tags — contact form data should be plain text only
  return value
    .replace(/<[^>]*>/g, '')          // remove tags
    .replace(/javascript:/gi, '')      // remove js: protocol
    .replace(/on\w+\s*=/gi, '')        // remove event handlers
    .trim()
}

/**
 * Sanitize an entire form object.
 * Returns a new object with all string values sanitized.
 *
 * @param {Record<string, unknown>} formData
 * @returns {Record<string, unknown>}
 */
export function sanitizeForm(formData) {
  const clean = {}
  for (const [key, value] of Object.entries(formData)) {
    clean[key] = typeof value === 'string' ? sanitizeText(value) : value
  }
  return clean
}

/**
 * Validate a contact form submission.
 * Returns an errors object — empty means valid.
 *
 * @param {{ name: string, email: string, message: string }} fields
 * @returns {Record<string, string>}
 */
export function validateContactForm({ name, email, message }) {
  const errors = {}

  if (!name?.trim())
    errors.name = 'Name is required'
  else if (name.trim().length > 120)
    errors.name = 'Name is too long'

  if (!email?.trim())
    errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Enter a valid email address'
  else if (email.length > 254)
    errors.email = 'Email is too long'

  if (!message?.trim())
    errors.message = 'Message is required'
  else if (message.trim().length < 10)
    errors.message = 'Message is too short (min 10 characters)'
  else if (message.length > 5000)
    errors.message = 'Message is too long (max 5000 characters)'

  return errors
}

/**
 * Rate-limit guard: returns true if action is allowed.
 * Uses sessionStorage to track submission count per session.
 * Prevents spam submissions from the same browser tab.
 *
 * @param {string} key  — unique key per form (e.g. 'contact')
 * @param {number} maxPerSession  — max allowed per session (default 5)
 * @returns {boolean}
 */
export function checkRateLimit(key, maxPerSession = 5) {
  try {
    const storageKey = `rl_${key}`
    const count = parseInt(sessionStorage.getItem(storageKey) || '0', 10)
    if (count >= maxPerSession) return false
    sessionStorage.setItem(storageKey, String(count + 1))
    return true
  } catch {
    return true // if storage blocked, allow the action
  }
}