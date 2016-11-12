import { SERVER_ERROR, LOGIN, LOGOUT } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

export function login (data) {
  return (dispatch) => {
    return fetch(config.getUrl("login"), data)
      .then(payload => dispatch({type: LOGIN, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function logout () {
  return (dispatch) => {
    return fetch(config.getUrl("logout"))
      .then(payload => dispatch({type: LOGOUT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}