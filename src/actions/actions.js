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
  return (data, options) => (dispatch) => {

    // Form options
    // ===========================================================================
    let opts = Object.assign({
      silent: false,
    }, options);

    let resData = {
      type: ACTION
    };
    // Process data object
    // ===========================================================================
    if (data) {
      resData.payload = {...data};
      if (data.id) {
        resData.id = data.id;
        opts.id = data.id;
      }
      if (data.data) {
        resData.payload.data = JSON.parse(data.data);
      }
    }
    Object.assign(resData, opts);

    // Form state action
    // ===========================================================================
    let stateData = { type: STATE_ACTION, ...opts};

    // Set app state to [loading]
    // ===========================================================================
    dispatch(Object.assign({state: 3}, stateData));

    // Fire a call to server
    // ===========================================================================
    return fetch(url, data).then(payload => {
      
      // Set app state to idle
      // ===========================================================================
      dispatch(Object.assign({state: 2}, stateData));
      
      if (payload.error) {
        // Fire [error] action if error found
        // ===========================================================================
        throw Object.assign({ type: ACTIONS['SERVER_ERROR'], text: payload.error, opts });
      } else if (payload.message || payload.success) {
        // Fire message to display proper message if responce contains only it
        // ===========================================================================
        if (!opts.silent) {
          dispatch({ type: ACTIONS['SUCCESS_MESSAGE'], text: (payload.message || payload.success) });
        }
      } else {
        resData.payload = payload;
      }

      // Dispatch proper action
      // ===========================================================================
      return dispatch(resData);
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

// Get results for all columns with a time delay
// ===========================================================================
export const getAllResults = (data) => (dispatch) => {
  let columns;
  let reader = readData('links');

  data.forEach((item) => {
    if(item && item.type === ACTIONS['GET_COLUMNS']) {
      columns = item.payload;
    }
  });
  
  columns.forEach((column, i) => {
    if (!column.open) return;
    let id = column.id;
    let state = {type: ACTIONS['SET_LINK_STATE'], id};
    let delay = (i > 4) ? i*1200 : 0;
    dispatch({state: 1, ...state});
    setTimeout(() => {
      dispatch(reader(column.data, {id, silent: true})).then(() => dispatch({state: 2, ...state})).catch(err => dispatch(throwError(err)));
    }, delay);
  });
}

// Create all default actions for all default entities
// ===========================================================================
export const readData = (type) => createAction(type, ACTIONS[`GET_${type.toUpperCase()}`], type.substring(0, type.length - 1));
export const createData = (type) => createAction(`add_${type}`, ACTIONS[`ADD_${type.toUpperCase()}`], type);
export const updateData = (type) => createAction(type, ACTIONS[`EDIT_${type.toUpperCase()}`], type);
export const deleteData = (type) => createAction(`remove_${type}`, ACTIONS[`DELETE_${type.toUpperCase()}`], type);

// Create specific action to fetch All data from a server:
// On app init - for example (utilizing Promise.all)
// ===========================================================================
export const fetchData = (getUser) => (dispatch) => Promise.all([
  (getUser) ? dispatch(readData('user')(null, {silent: true})) : null,
  dispatch(readData('alerts')(null, {silent: true})),
  dispatch(readData('reports')(null, {silent: true})),
  dispatch(readData('sets')(null, {silent: true})),
  dispatch(readData('sources')(null, {silent: true})),
  dispatch(readData('columns')({data: 1}, {silent: true}))
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