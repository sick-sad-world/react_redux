import { SERVER_ERROR, LOGIN, LOGOUT, SET_APP_STATE } from '../actions/types';
import fetch from '../fetch';

export const throwError = (error) => (dispatch) => {
  return dispatch({type: SERVER_ERROR, payload: {error}});
}

export const login = (data, silent) => (dispatch) => fetch('login', data).then(payload => dispatch({type: LOGIN, payload}))

export const logout = (silent) => (dispatch) => fetch('logout').then(payload => dispatch({type: LOGOUT, payload}));

export const setAppState = (state) => {
  if (typeof state !== 'number' && (state < 0 || state > 4)) {
    throw new Error(`App state should be a number beetween 0 and 4 where: 0 - initial, 1 - fetching (initial data), 2 - idle, 3 - loading (some requests are processed), 4 - error`);
  } else {
    return {
      type: SET_APP_STATE,
      appState: state
    }
  }
}