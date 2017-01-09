// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import fetch from '../fetch';

// Action constructor (for default AJAX comunnication)
// Since most of our actions are the same - i create this
// ===========================================================================
export default function createAction (url, ACTION, type) {
  let STATE_ACTION = `SET_${type.toUpperCase()}_STATE`; 
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
    dispatch({
      type: STATE_ACTION,
      state: 3,
      silent
    });

    let reqData =  {...data};

    // Fire a call to server
    // ===========================================================================
    return fetch(url, data).then(payload => {
      
      // Set app state to idle
      // ===========================================================================
      dispatch({
        type: STATE_ACTION,
        state: 2,
        silent: silent
      });
      
      if (payload.error) {
        
        // Fire [error] action if error found
        // ===========================================================================
        throw { type: ACTIONS['SERVER_ERROR'], text: payload.error, silent };

      } else if (payload.message || payload.success) {

        // Fire message to display proper message if responce contains only it
        // ===========================================================================
        if (!silent) {
          dispatch({ type: ACTIONS['MESSAGE'], text: (payload.message || payload.success) });
        }

        // Should be removed as we organize our workflow with backend
        // ===========================================================================
        if (reqData.data) {
          reqData.data = JSON.parse(reqData.data);
        }
        payload = reqData;
      }

      // Dispatch proper action
      // ===========================================================================
      return dispatch({type: ACTION, payload});
    });

  }
}

// Set app state (simple and SYNC)
// ===========================================================================
export const setAppState = (state) => ({ type: ACTIONS['SET_APP_STATE'], state });

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
  error.state = 4;
  return dispatch(error);
};

// Get single result for a specific column
// ===========================================================================
export const getResult = (column) => (dispatch) => {
  dispatch({type: ACTIONS['SET_LINKS_STATE'], id: column.id, state: 3})
  return fetch('links', column.data).then(payload => {
    dispatch({type: ACTIONS['SET_LINKS_STATE'], id: column.id, state: 2});
    dispatch({type: ACTIONS['GET_LINKS'], payload: payload, id: column.id});
  });
}

// Get results for all columns with a time delay
// ===========================================================================
export const getAllResults = (data) => (dispatch) => {
  let columns;

  data.forEach((item) => {
    if(item && item.type === ACTIONS['GET_COLUMNS']) {
      columns = item.payload;
    }
  });
  
  columns.forEach((column, i) => {
    if (!column.open) return;
    setTimeout(() => dispatch(getResult(column)).catch(err => dispatch(throwError(err))), i*1500);
  });
}

// Create all default actions for all default entities
// ===========================================================================
export const readData = (type) => createAction(type, ACTIONS[`GET_${type.toUpperCase()}`], type);
export const createData = (type) => createAction(`add_${type}`, ACTIONS[`ADD_${type.toUpperCase()}`], type);
export const updateData = (type) => createAction(type, ACTIONS[`EDIT_${type.toUpperCase()}`], type);
export const deleteData = (type) => createAction(`remove_${type}`, ACTIONS[`DELETE_${type.toUpperCase()}`], type);

// Create specific action to fetch All data from a server:
// On app init - for example (utilizing Promise.all)
// ===========================================================================
export const fetchData = (getUser) => (dispatch) => Promise.all([
  (getUser) ? dispatch(readData('user')(true)) : null,
  dispatch(readData('alerts')(true)),
  dispatch(readData('reports')(true)),
  dispatch(readData('sets')(true)),
  dispatch(readData('sources')(true)),
  dispatch(readData('columns')({data: 1}, true))
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