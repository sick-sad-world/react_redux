import * as ACTIONS from './types';
import fetch from '../fetch';

export const setAppState = (state) => ({ type: ACTIONS['SET_APP_STATE'], appState: state });

export const throwError = (error) => (dispatch) => dispatch({
  type: (error.event) ? ACTIONS['HTML_ERROR'] : error.type || ACTIONS['SERVER_ERROR'],
  text: (error.event) ? error.url : error.text || ''
});

export default function createAction (url, ACTION) {

  if (typeof url !== 'string' && !url && !url.length) {
    throw new Error('Please provide url for backend endpoint.');
  }

  return (data, silent) => (dispatch) => {

    if (typeof data === 'boolean') {
      silent = data;
      data = undefined;
    }

    if (!silent) {
      dispatch(setAppState(3));
    }
    return fetch(url, data).then(payload => {
      if (!silent) {
        dispatch(setAppState(2));
        if (payload.error) {
          throw { type: ACTIONS['SERVER_ERROR'], text: payload.error };
        } else if (payload.message || payload.success) {
          throw { type: ACTIONS['MESSAGE'], text: (payload.message || payload.success) };
        }
      }
      return dispatch({type: ACTION, payload, silent});
    });

  }
}

export const readData = (type) => createAction(type, ACTIONS[`GET_${type.toUpperCase()}`]);
export const createData = (type) => createAction(`add_${type}`, ACTIONS[`CREATE_${type.toUpperCase()}`]);
export const updateData = (type) => createAction(type, ACTIONS[`UPDATE_${type.toUpperCase()}`]);
export const deleteData = (type) => createAction(`remove_${type}`, ACTIONS[`DELETE_${type.toUpperCase()}`]);
export const fetchData = (silent, getUser) => (dispatch) => Promise.all([
  (getUser) ? dispatch(readData('user')(silent)) : null,
  dispatch(readData('alerts')(silent)),
  dispatch(readData('reports')(silent)),
  dispatch(readData('columns')(silent)),
  dispatch(readData('sets')(silent)),
  dispatch(readData('sources')(silent))
]);

export const login = (data) => (dispatch) => fetch('login', data).then(payload => {
  if (payload.error) {
    throw { type: ACTIONS['SERVER_ERROR'], text: payload.error };
  } else {
    return dispatch({type: ACTIONS['LOGIN']})
  }
})
export const logout = () => (dispatch) => fetch('logout').then(payload => dispatch({type: ACTIONS['LOGOUT']}));
