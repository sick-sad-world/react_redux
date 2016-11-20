import jsonp from "browser-jsonp";
export default function fetch (url, data, opts) {
  return new Promise((resolve, reject) => {
    jsonp(Object.assign({
      url: url,
      data: data,
      error: reject,
      success: resolve
    }, opts));
  });
}