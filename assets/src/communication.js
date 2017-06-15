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

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch(url, data) {
  return new Promise((resolve, reject) => {
    jsonp({
      url: `${BASEURL}/${url}`,
      data: transformRequestData(data),
      error: reject,
      success(payload, ...args) {
        delete payload.callback;
        resolve(payload);
      },
      complete(payload, params) {
        let tag = [...document.querySelectorAll('head script[src]')].find(el => el.src.indexOf(params.computedUrl) > -1);
        tag.parentElement.removeChild(tag);
        tag = null;
      }
    });
  });
}
