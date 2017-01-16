// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import { reduce, isPlainObject, omitBy, isUndefined } from 'lodash';
import fetch from '../fetch';
import moment from 'moment';

// Action constructor (for default AJAX comunnication)
// Since most of our actions are the same - i create this
// ===========================================================================
export const createAction = (entity, action) => {

  // Default wrapper for [redux-thunk] actions
  // ===========================================================================
  return (data, options) => (dispatch) => {

    let url;
    let type;

    let opts = Object.assign({
      state: true,
      message: true,
      ignoreError: false,
      id: null
    }, options);

    let id = (data) ? data.id || opts.id : opts.id;

    // Compose data for call
    // ===========================================================================
    let reqData = reduce(data, (acc, v, k) => {
      if (isPlainObject(v)) {
        acc[k] = JSON.stringify(v);
      } else if (!isUndefined(v)) {
        acc[k] = v;
      }
      return acc;
    }, {});

    switch (action) {
      case 3:
        if (entity === 'user') {
          url = 'user';
          type = ACTIONS['GET_USER'];
        } else {
          url = entity+'s';
          type = ACTIONS[`GET_${entity.toUpperCase()}S`];
        }
        break;
      case 4:
        url = 'add_'+entity;
        type = ACTIONS[`ADD_${entity.toUpperCase()}`];
        break;
      case 5:
        url = entity;
        type = ACTIONS[`EDIT_${entity.toUpperCase()}`];
        break;
      case 6:
        url = 'remove_'+entity;
        type = ACTIONS[`DELETE_${entity.toUpperCase()}`];
        break;
      case 7:
        url = `sort_${entity}s`;
        type = ACTIONS[`SORT_${entity.toUpperCase()}S`];
        break;
      case 8:
        url = entity;
        type = ACTIONS[`${entity.toUpperCase()}`];
        break;
      default:
        throw {}
    }

    // Set app state to [loading]
    // ===========================================================================
    if (opts.state) {
      dispatch({
        type: ACTIONS['SET_APP_STATE'],
        state: action
      });
    }

    // Send message
    // ===========================================================================
    if (opts.message) {
      dispatch({
        type: ACTIONS['PUSH_MESSAGE'],
        payload: {
          type: 'loading',
          entity,
          action
        }
      });
    }

    // Fire a call to server
    // ===========================================================================
    return fetch(url, reqData).then(payload => {
      
      // Set app state to idle
      // ===========================================================================
      if (opts.state) {
        dispatch({
          type: ACTIONS['SET_APP_STATE'],
          state: 2
        });
      }
      
      if (payload.error && !opts.ignoreError) {
        // Fire [error] action if error found
        // ===========================================================================
        throw payload.error;
      } else if (payload.message || payload.success) {
        payload = data;
      }

      // Fire message to display proper message if responce contains only it
      // ===========================================================================
      if (opts.message) {
        dispatch({
          type: ACTIONS['PUSH_MESSAGE'],
          payload: {
            id: moment().unix(),
            type: 'success',
            entity,
            action,
            entityId: id,
            text: payload.message || payload.success || opts.message
          }
        });
      }

      // Dispatch proper action
      // ===========================================================================
      delete payload.callback;
      if (action === 5) delete payload.id;
      return dispatch({
        type,
        payload,
        id
      });
    });

  }
}

// Set app state (simple and SYNC)
// ===========================================================================
export const setAppState = (state) => ({ type: ACTIONS['SET_APP_STATE'], state });

// Hide message 
// @case onClick or by timeout
// ===========================================================================
export const hideMessage = (id) => ({type: ACTIONS['HIDE_MESSAGE'], id });

// Throw action related to error (SYNC)
// ===========================================================================
export const throwError = (error) => (dispatch) => {
  let action = {
    type: ACTIONS['ERROR'],
    payload: {
      type: 'error',
      text: ''
    }
  }

  if (error instanceof Error) {
    console.error(error);
    action.payload.type = 'client error';
    action.payload.text = error.stack;
  } else if (error.event) {
    action.payload.type = 'server error';
    action.payload.text = error.url;
  } else {
    action.payload.text = error;
  }

  return dispatch(action);
};

// Get results for a single column
// @data - column data Object required
// ===========================================================================
export const getResults = (data, id) => (dispatch) => {
  // Set state to loading
  // ===========================================================================
  dispatch({
    state: 3,
    type: ACTIONS['LINKS_STATE'],
    id
  });

  // Run actual call
  // ===========================================================================
  return fetch('links', omitBy(data, isUndefined)).then((payload) => {
    dispatch({
      type: ACTIONS['GET_LINKS'],
      id,
      state: 2,
      payload
    })
  });
}

// Get results for all columns with a time delay
// ===========================================================================
export const getAllResults = (data) => (dispatch) => {
  let columns;

  // Pick exacly columns data to iterate over for Results fetching
  // ===========================================================================
  data.forEach((item) => {
    if(item && item.type === ACTIONS['GET_COLUMNS']) {
      columns = item.payload;
    }
  });
  
  columns.forEach((column, i) => {
    if (!column.open) return;
    let delay = (i > 4) ? i*1200 : 0;
    setTimeout(() => dispatch(getResults(column.data, column.id)).catch(err => dispatch(throwError(err))), delay);
  });
}

// Create specific action to fetch All data from a server:
// On app init - for example (utilizing Promise.all)
// ===========================================================================
export const fetchData = (getUser) => (dispatch) => {
  let opts = {
    state: false,
    message: false
  };

  return Promise.all([
    (getUser) ? dispatch(createAction('user', 3)(null, opts)) : null,
    dispatch(createAction('alert', 3)(null, opts)),
    dispatch(createAction('report', 3)(null, opts)),
    dispatch(createAction('set', 3)(null, opts)),
    dispatch(createAction('source', 3)(null, opts)),
    dispatch(createAction('column', 3)({data: 1}, opts))
  ])
};