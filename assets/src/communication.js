import jsonp from 'browser-jsonp';
import { reduce, isPlainObject, isNull, isUndefined } from 'lodash';

export const BASEURL = 'http://api.trendolizer.com/v3';

// Transform data for serialization function
// Nested objects - to string, exclude [null, undefined]
// ===========================================================================
export const transformRequestData = data => reduce(data, (acc, v, k) => {
  if (isPlainObject(v) || v instanceof Array) {
    acc[k] = JSON.stringify(v);
  } else if (!isNull(v) && !isUndefined(v) && v !== '') {
    acc[k] = v;
  }
  return acc;
}, {});

let counter = 0;
window.stack = {};

export function cancelAll() {
  Object.values(window.stack).forEach(abort => abort());
}

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch(url, data) {
  return new Promise((resolve, reject) => {
    const id = counter;
    const { abort } = jsonp({
      url: `${BASEURL}/${url}`,
      data: transformRequestData(data),
      error: reject,
      success: resolve,
      complete(payload, params) {
        abort();
      }
    });
    window.stack[id] = abort;
    counter += 1;
  });
}
