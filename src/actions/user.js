import { SERVER_ERROR, GET_USER, EDIT_USER } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

export default function getUser () {
  return (dispatch) => {
    return fetch(config.getUrl("user"))
      .then(payload => dispatch({type: GET_USER, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function editUser (data) {
  return (dispatch) => {
    return fetch(config.getUrl("user", data))
      .then(payload => dispatch({type: GET_USER, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}