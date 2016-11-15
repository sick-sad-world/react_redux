import { SERVER_ERROR, GET_ALERTS, SORT_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

export default function getAlerts () {
  return (dispatch) => {
    return fetch(config.getUrl("alerts"))
      .then(payload => dispatch({type: GET_ALERTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function sortAlerts (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("sort_alerts"), payload)
      .then(payload => dispatch({type: SORT_ALERTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function addAlert (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("add_alert"), payload)
      .then(payload => dispatch({type: ADD_ALERT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function editAlert (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("alert"), payload)
      .then(payload => dispatch({type: EDIT_ALERT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function deleteAlert (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("remove_alert"), payload)
      .then(payload => dispatch({type: EDIT_ALERT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}