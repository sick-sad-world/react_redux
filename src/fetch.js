import jsonp from 'browser-jsonp';

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch (url, data, opts) {
  return new Promise((resolve, reject) => {
    jsonp(Object.assign({
      url: `http://api.trendolizer.com/v3/${url}`,
      data: data,
      error: reject,
      success: resolve
    }, opts));
  });
}