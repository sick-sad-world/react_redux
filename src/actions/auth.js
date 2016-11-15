import { SERVER_ERROR, LOGIN, LOGOUT } from "./types";
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

export function getAppData () {
  return (dispatch, getState) => {
    if (getState().user.id) {
      return Promise.all([
        dispatch(getAlerts()),
        dispatch(getReports()),
        dispatch(getColumns())
      ]).catch(payload => dispatch({type: SERVER_ERROR, payload}));
    } else {
      return Promise.resolve();
    }
  };
}