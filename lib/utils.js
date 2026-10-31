/**
 * Meraki - General Utilities & Helpers
 */

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} currency - default 'USD'
 * @returns {string}
 */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Helper to combine class names conditionally.
 * @param  {...any} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
