import { SERVER_ERROR, LOGIN, LOGOUT, SET_APP_STATE } from '../actions/types';
import fetch from '../fetch';

export const throwError = (error) => (dispatch) => dispatch({type: SERVER_ERROR, payload: {error}});

export const login = (data, silent) => (dispatch) => fetch('login', data).then(payload => dispatch({type: LOGIN, payload}))

export const logout = (silent) => (dispatch) => fetch('logout').then(payload => dispatch({type: LOGOUT, payload}));

export const setAppState = (state) => ({ type: SET_APP_STATE, appState: state });