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
    let messageId = moment().unix();

    // Compose data for call
    // ===========================================================================
    let reqData = reduce(data, (acc, v, k) => {
      if (isPlainObject(v)) {
        acc[k] = JSON.stringify(v);
      } else if (!isUndefined(v)) {
        acc[k] = v;
      }
      return acc;
    }, {id});

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
      dispatch(sendMessage({
        id: messageId,
        type: 'loading',
        entity,
        action,
        entityId: id
      }));
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
        throw {
          id: messageId,
          entity,
          action,
          entityId: id,
          error: payload.error
        };
      } else if (payload.message || payload.success) {
        payload = data;
      }

      // Fire message to display proper message if responce contains only it
      // ===========================================================================
      if (opts.message) {
        dispatch(sendMessage({
          type: 'success',
          text: payload.success || opts.message
        }, messageId));
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

// Throw action related to error (SYNC)
// ===========================================================================
export const throwError = (error) => (dispatch) => {
  let action = {
    type: ACTIONS['ERROR'],
    payload: {
      id: moment().unix(),
      visible: true,
      type: 'error',
      text: ''
    }
  }

  if (error instanceof Error) {
    action.payload.type = 'error';
    action.payload.text = error.stack;
  } else if (error.event) {
    action.payload.type = 'error';
    action.payload.text = error.url;
  } else {
    if (error.messageId) {
      action.id = error.messageId;
      action.payload = error;
    } else {
      Object.assign(action.payload, error);
    }
  }

  return dispatch(action);
};

export const sendMessage = (mess, id) => {
  if (id) {
    return {
      type: ACTIONS['EDIT_MESSAGE'],
      id,
      payload: mess
    };
  } else {
    return {
      type: ACTIONS['PUSH_MESSAGE'],
      payload: Object.assign({
        id: moment().unix(),
        visible: true
      }, mess)
    };
  }
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