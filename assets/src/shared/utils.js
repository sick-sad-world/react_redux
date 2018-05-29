/**
 * Generate pseudo-random id string
 * @param {String} name Prefix for id
 * @param {Number} length length of numeric part
 */
export function makeid(name, length = 5) {
  let text = `${name}-`;
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

/**
 * Call context function, but only if exsits, since it easily can be missing.
 * Just simple wrapper over condition
 * @param {Function} func Function to run
 * @param {*} args Arguments that will be passed to function
 */
export function callContextAction(func, ...args) {
  if (typeof func === 'function') {
    func(...args);
  }
}

/**
 * Check if variable is a valid (non-empty) string
 * @param {Any} str Variable to test
 */
export const isValStr = (str) => typeof str === 'string' && str.length > 0;