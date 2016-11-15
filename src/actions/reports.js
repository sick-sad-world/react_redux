import { SERVER_ERROR, GET_REPORTS, SORT_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

export default function getReports () {
  return (dispatch) => {
    return fetch(config.getUrl("reports"))
      .then(payload => dispatch({type: GET_REPORTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function sortReports (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("sort_reports"), payload)
      .then(payload => dispatch({type: SORT_REPORTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function addReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("add_report"), payload)
      .then(payload => dispatch({type: ADD_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function editReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("report"), payload)
      .then(payload => dispatch({type: EDIT_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}

export function deleteReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("remove_report"), payload)
      .then(payload => dispatch({type: EDIT_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}));
  }
}