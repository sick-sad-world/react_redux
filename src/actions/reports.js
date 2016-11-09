import { SERVER_ERROR, GET_REPORTS, SORT_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from './types';
import config from '../app-config';
import fetch from 'jsonp-es6';

const defaultReport = {
  owner_id: 0,
  active: 1,
  name: '',
  columns: [],
  frequency: 1440,
  order: 0,
  next_send: '',
  last_sent: '',
  recipient: ''
};

export default function getReports () {
  return (dispatch) => {
    return fetch(config.getUrl('reports'))
      .then(payload => dispatch({type: GET_REPORTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function sortReports (payload) {
  return (dispatch) => {
    return fetch(config.getUrl('sort_reports'), payload)
      .then(payload => dispatch({type: SORT_REPORTS, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function addReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl('add_report'), Object.assign({}, defaultReport, payload))
      .then(payload => dispatch({type: ADD_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function editReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl('report'), payload)
      .then(payload => dispatch({type: EDIT_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}

export function deleteReport (payload) {
  return (dispatch) => {
    return fetch(config.getUrl('remove_report'), payload)
      .then(payload => dispatch({type: EDIT_REPORT, payload}))
      .catch(payload => dispatch({type: SERVER_ERROR, payload}))
  }
}