import jsonp from 'browser-jsonp';
import { encodeUrlParams } from 'functions';
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
export default function fetch(url, data, opts) {
  return new Promise((resolve, reject) => {
    // const id = counter;
    const { abort } = jsonp({
      url: `${BASEURL}/${url}`,
      data: transformRequestData(data),
      error: reject,
      success: resolve,
      ...opts,
      complete() {
        abort();
      }
    });
    // window.stack[id] = abort;
    // counter += 1;
  });
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
  });
}
