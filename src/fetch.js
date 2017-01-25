import jsonp from 'browser-jsonp';
import { transformRequestData } from './helpers/functions';

// Just an wrapper to a third-party module
// which provides default settings and callback mapping
// ===========================================================================
export default function fetch (url, data) {
  return new Promise((resolve, reject) => {
    jsonp({
      url: `http://api.trendolizer.com/v3/${url}`,
      data: transformRequestData(data),
      error: reject,
      success (payload) {
        delete payload.callback;
        resolve(payload);
      }
    });
  });
}