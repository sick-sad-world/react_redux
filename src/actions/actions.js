// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import fetch from '../fetch';

// Action constructor (for default AJAX comunnication)
// Since most of our actions are the same - i create this
// ===========================================================================
export default function createAction (url, ACTION, text) {

  // Check whatever we provided an URL (otherwise no point doing something)
  // ===========================================================================
  if (typeof url !== 'string' && !url && !url.length) {
    throw new Error('Please provide url for backend endpoint.');
  }

  // Default wrapper for [redux-thunk] actions
  // ===========================================================================
  return (data, silent) => (dispatch) => {

    // Set parameters, data and [silent] mode
    // ===========================================================================
    if (typeof data === 'boolean') {
      silent = data;
      data = undefined;
    }

    // Set app state to [loading]
    // ===========================================================================
    if (!silent) {
      dispatch(setAppState(3, text));
    }

    let reqData =  (data) ? Object.assign({}, data) : {};

    // Fire a call to server
    // ===========================================================================
    return fetch(url, data).then(payload => {
      
      if (!silent) {
        
        // Set app state to idle
        // ===========================================================================
        dispatch(setAppState(2));

        if (payload.error) {
          
          // Fire [error] action if error found
          // ===========================================================================
          throw { type: ACTIONS['SERVER_ERROR'], text: payload.error };

        } else if (payload.message || payload.success) {

          // Fire message to display proper message if responce contains only it
          // ===========================================================================
          dispatch({ type: ACTIONS['MESSAGE'], text: (payload.message || payload.success) });

          // Should be removed as we organize our workflow with backend
          // ===========================================================================
          if (reqData.data) {
            reqData.data = JSON.parse(reqData.data);
          }
          payload = reqData;
        }
      }

      // Dispatch proper action
      // ===========================================================================
      return dispatch({type: ACTION, payload, silent});
    });

  }
}

// Set app state (simple and SYNC)
// ===========================================================================
export const setAppState = (appState, actionState) => ({ type: ACTIONS['SET_APP_STATE'], appState, actionState });

// Throw action related to error (SYNC)
// ===========================================================================
export const throwError = (error) => (dispatch) => {
  if (error instanceof Error) {
    error = {
      type: ACTIONS['CLIENT_ERROR'],
      text: error.stack
    }
  } else if (error.event) {
    error = {
      type: ACTIONS['HTML_ERROR'],
      text: error.url
    }
  } else {
    error = {
      type: error.type || ACTIONS['SERVER_ERROR'],
      text: error.text || error
    }
  }
  return dispatch(error);
};

// Create all default actions for all default entities
// ===========================================================================
export const readData = (type) => createAction(type, ACTIONS[`GET_${type.toUpperCase()}`]);
export const createData = (type) => createAction(`add_${type}`, ACTIONS[`ADD_${type.toUpperCase()}`], `Creating new ${type}`);
export const updateData = (type) => createAction(type, ACTIONS[`EDIT_${type.toUpperCase()}`], `Saving ${type} changes`);
export const deleteData = (type) => createAction(`remove_${type}`, ACTIONS[`DELETE_${type.toUpperCase()}`], `Deleting ${type}`);

// Create specific action to fetch All data from a server:
// On app init - for example (utilizing Promise.all)
// ===========================================================================
export const fetchData = (silent, getUser) => (dispatch) => Promise.all([
  (getUser) ? dispatch(readData('user')(silent)) : null,
  dispatch(readData('alerts')(silent)),
  dispatch(readData('reports')(silent)),
  dispatch(readData('columns')({data: 1}, silent)),
  dispatch(readData('sets')(silent)),
  dispatch(readData('sources')(silent))
]);

// Create auth actions
// ===========================================================================
export const login = (data) => (dispatch) => fetch('login', data).then(payload => {
  if (payload.error) {
    throw { type: ACTIONS['SERVER_ERROR'], text: payload.error };
  } else {
    return dispatch({type: ACTIONS['LOGIN']})
  }
});
export const logout = (data) => (dispatch) => fetch('logout', data).then(payload => {
  if (payload.error) {
    throw { type: ACTIONS['SERVER_ERROR'], text: payload.error };
  } else {
    return dispatch({type: ACTIONS['LOGOUT']})
  }
});