import { SERVER_ERROR } from './types';
import config from '../app-config';
import fetch from '../fetch';
import { setAppState } from './app';

export default function basicAction (url, ACTION) {
  return function (payload, silent) {
    if (typeof payload === 'boolean') {
      silent = payload;
      payload = undefined;
    }
    return (dispatch) => {
      !silent && dispatch(setAppState(3));
      return fetch(config.getUrl(url), payload)
        .then(payload => {
          let result = dispatch({type: ACTION, payload});
          !silent && dispatch(setAppState(2));
          return result;
        })
        .catch(payload => {
          let result = dispatch({type: SERVER_ERROR, payload});
          !silent && dispatch(setAppState(2));
          return result;
        });
    }
  }
}