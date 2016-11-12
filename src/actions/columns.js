import { SERVER_ERROR, GET_COLUMNS, SORT_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from "./types";
import config from "../app-config";
import fetch from "jsonp-es6";

const defaultColumn = {
    name: "",
    data: {
      sort: "rate_likes",
      limit: 30,
      direction: "desc",
      infinite: 1,
      autoreload: 0
    },
    open: 1,
    owner_id: null,
    order: null,
    display_settings: ["title", "url", "image", "description", "likes"],
};

export default function getColumns () {
  return (dispatch) => {
    return fetch(config.getUrl("columns"))
      .then(payload => dispatch({type: GET_COLUMNS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function sortColumns (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("sort_columns"), payload)
      .then(payload => dispatch({type: SORT_COLUMNS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function addColumn (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("add_column"), Object.assign({}, defaultColumn, payload))
      .then(payload => dispatch({type: ADD_COLUMN, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function editColumn (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("column"), payload)
      .then(payload => dispatch({type: EDIT_COLUMN, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function deleteColumn (payload) {
  return (dispatch) => {
    return fetch(config.getUrl("remove_column"), payload)
      .then(payload => dispatch({type: DELETE_COLUMN, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}