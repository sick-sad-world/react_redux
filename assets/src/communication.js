import jsonp from 'browser-jsonp';
import reduce from 'lodash/reduce';
import isPlainObject from 'lodash/isPlainObject';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export const BASEURL = 'http://api.trendolizer.com/v3';

export const encodeUrlParams = params => (`?${Object.keys(params).map(prop => [prop, params[prop]].map(encodeURIComponent).join('=')).join('&')}`);

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
export default function fetch(url, data, opts) {
  let abort = null;
  const promise = new Promise((resolve, reject) => {
    const request = jsonp({
      url: `${BASEURL}/${url}`,
      data: transformRequestData(data),
      error: reject,
      success: resolve,
      ...opts,
      complete() {
        abort();
      }
    });
    abort = request.abort;
  });
  promise.abort = abort;
  return promise;
}

export function fetchScript(url, opts) {
  return new Promise((resolve, reject) => {
    if (!url) return reject({ error: 'Url not provided' });
    const tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.src = url + ((opts) ? encodeUrlParams(opts) : '');
    tag.onload = () => resolve({ url, success: true });
    tag.onerror = err => reject(err);
    document.body.appendChild(tag);
    return true;
  });
}
