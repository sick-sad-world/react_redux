import { SERVER_ERROR, LOGIN, LOGOUT, SET_APP_STATE } from './types';
import config from '../app-config';
import fetch from '../fetch';

import getAlerts from '../actions/alerts';
import getReports from '../actions/reports';
import getColumns from '../actions/columns';
import getSourcesets from '../actions/sourcesets';
import getSources from '../actions/sources';

export function login (data, silent) {
  return (dispatch) => {
    return fetch(config.getUrl('login'), data)
      .then(payload => dispatch({type: LOGIN, payload}))
      .catch(payload => {
        dispatch({type: SERVER_ERROR, payload});
        dispatch(setAppState(2));
      });
  }
}

export function logout (silent) {
  return (dispatch) => {
    return fetch(config.getUrl('logout'))
      .then(payload => dispatch({type: LOGOUT, payload}))
      .catch(payload => {
        dispatch({type: SERVER_ERROR, payload});
        dispatch(setAppState(2));
      });
  }
}

export function setAppState (state) {
  if (typeof state !== 'number' && (state < 0 || state > 4)) {
    throw new Error(`App state should be a number beetween 0 and 4 where: 0 - initial, 1 - fetching (initial data), 2 - idle, 3 - loading (some requests are processed), 4 - error`);
  } else {
    return {
      type: SET_APP_STATE,
      appState: state
    }
  }
}

export function getAppData (silent) {
  return (dispatch) => {
    return Promise.all([
      dispatch(getAlerts(silent)),
      dispatch(getReports(silent)),
      dispatch(getColumns(silent)),
      dispatch(getSourcesets(silent)),
      dispatch(getSources(silent))
    ]).catch(payload => dispatch({type: SERVER_ERROR, payload}));
  };
}