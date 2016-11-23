import jsonp from 'browser-jsonp';
export default function fetch (url, data, opts) {
  return new Promise((resolve, reject) => {
    jsonp(Object.assign({
      url: `http://api.trendolizer.com/v3/${url}`,
      data: data,
      complete: reject,
      success: resolve
    }, opts));
  });
}