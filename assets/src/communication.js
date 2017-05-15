import jsonp from 'browser-jsonp';
import { reduce, isPlainObject, isNull, isUndefined } from 'lodash';


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

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch(url, data) {
  return new Promise((resolve, reject) => {
    jsonp({
      url: `http://api.trendolizer.com/v3/${url}`,
      data: transformRequestData(data),
      error: reject,
      success(payload) {
        delete payload.callback;
        resolve(payload);
      }
    });
  });
}
