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
 * Helper function for extracting numeric IDS from complex strings
 * @param {String} str String to test
 * @param {Any} def Return value if was unable to extract nubmer
 */
export const extractNumber = (str, def = 0) => {
  const num = parseInt(str);
  return (Number.isNaN(num)) ? def : num;
};

/**
 * Simple utility used to check enum on value containing
 * @param {String|Array} val Enum to check
 * @param {Any} identity Value to check against
 */
export const contain = (val, identity) => val.indexOf(identity) > -1;

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

/**
 * This utility function used to parse Search string key:val key2:val2
 * @param {String} str value to parse
 * @param {String} default value if none props are found in query
 * @return {Object} parsed list of key/val pairs to search for
 */
export const parseSearchStr = (str, def = 'name') => {
  return str.split(' ').map((substr) => substr.split(':')).reduce((acc, [prop, val]) => {
    acc[(val) ? prop : def] = (val) ? val : prop;
    return acc;
  }, {})
}