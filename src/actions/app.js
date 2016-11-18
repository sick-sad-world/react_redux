import { SERVER_ERROR, LOGIN, LOGOUT, SET_APP_STATE } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

import getAlerts from "../actions/alerts";
import getReports from "../actions/reports";
import getColumns from "../actions/columns";

export function login (data) {
  return (dispatch) => {
    return fetch(config.getUrl("login"), data)
      .then(payload => dispatch({type: LOGIN, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function logout () {
  return (dispatch) => {
    return fetch(config.getUrl("logout"))
      .then(payload => dispatch({type: LOGOUT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function setAppState (state) {
  if (typeof state !== "number" && (state < 0 || state > 4)) {
    throw new Error(`App state should be a number beetween 0 and 4 where: 
                      0 - error, 
                      1 - initial, 
                      2 - fetching (initial data), 
                      3 - idle, 
                      4 - loading (some requests are processed)`);
  } else {
    return {
      type: SET_APP_STATE,
      appState: state
    }
  }
}

export function getAppData () {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(getAlerts()),
      dispatch(getReports()),
      dispatch(getColumns())
    ]).catch(payload => dispatch({type: SERVER_ERROR, payload}));
  };
}