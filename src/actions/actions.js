// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import { keys } from 'lodash';
import { transformRequestData, createMessage } from '../helpers/functions';
import fetch from '../fetch';
import moment from 'moment';

const actionPrefix = {
  3: {url: '', action: 'get_'},
  4: {url: 'add_', action: 'add_'},
  5: {url: '', action: 'edit_'},
  6: {url: 'remove_', action: 'remove_'},
  7: {url: 'sort_', action: 'sort_'},
  8: {url: '', action: ''}
};

// Set app state (simple and SYNC)
// ===========================================================================
export const setAppState = (state) => ({ type: ACTIONS['SET_APP_STATE'], state });

// Set Result state (simple and SYNC)
// ===========================================================================
export const setResultState = (id, state) => ({ type: ACTIONS['LINKS_STATE'], id, state });

// Throw action related to error (SYNC)
// ===========================================================================
export const throwError = (error) => (dispatch) => {
  let action;
  if (error instanceof Error) {
    console.error(error);
    action = {
      type: ACTIONS['ERROR'],
      payload: createMessage({ type: 'error', text: 'Javascript Error: ' + error.toString()+' '+error.stack})
    };
  } else if (error.event) {
    action = {
      type: ACTIONS['ERROR'],
      payload: createMessage({ type: 'error', text: 'Network Error: ' + error.url})
    };
  } else {
    if (error.id) {
      action = { ...error, type: ACTIONS['EDIT_MESSAGE'] }
    } else {
      action = {
        type: ACTIONS['PUSH_MESSAGE'],
        payload: createMessage(error)
      }
    }
  }
  return dispatch(action);
};

// Create or edit message in system notification module
// ===========================================================================
export const sendMessage = (id, data) => {
  if (typeof id === 'number') {
    return {
      id,
      type: ACTIONS['EDIT_MESSAGE'],
      payload: data
    }
  } else {
    return {
      type: ACTIONS['PUSH_MESSAGE'],
      payload: createMessage(data)
    }
  }
};

// Action constructor (for default AJAX comunnication)
// Since most of our actions are the same - i create this
// ===========================================================================
export const createAction = (entity, action) => (data, options) => (dispatch) => {
  options = Object.assign({
    state: true,
    message: true,
  }, options);

  const url = actionPrefix[action].url+entity;
  const type = ACTIONS[(actionPrefix[action].action+entity).toUpperCase()];
  const messageId = moment().unix()
  let message = {
    entity,
    action,
    entityId: (data) ? data.id : null
  };

  if (options.state) dispatch(setAppState(action));

  if (options.message) dispatch(sendMessage(null, {...message, id: messageId, type: 'loading'}));

  return fetch(url, data)
    // Set back state to idle
    // ===========================================================================
    .then((payload) => {
      if (options.state) dispatch(setAppState(2));
      return payload;
    })
    // Throw error - if error message is presented
    // ===========================================================================
    .then((payload) => {
      if (payload.error) {
        throw {
          id: messageId,
          payload: {
            type: 'error',
            text: payload.error
          }
        }
      } else {
        return payload;
      }
    })
    // Display message if need and ensure that payload is actual data 
    // ===========================================================================
    .then((payload) => {
      let message = payload.success || payload.message;
      if (options.message) {
        dispatch(sendMessage(messageId, {
          type: 'success',
          text: (typeof options.message === 'string') ? options.message : message
        }));
      }
      return (message) ? data : payload;
    })
    // Create action Object
    // ===========================================================================
    .then((payload) => {
      let result = { type, payload };
      if ((action === 5 || action === 6) && data && data.id) {
        result.id = data.id;
      }
      return result;
    })
    .then(dispatch);
};

// Get results for a single column
// @data - column data Object required
// ===========================================================================
export const createResultAction = (action, url, type) => (data, options) => (dispatch) => {
  options = Object.assign({
    id: null,
    message: true,
    state: true
  }, options);

  const messageId = moment().unix();
  let message = {
    action,
    entity: 'result',
    entityId: data.hash || options.id
  };

  if (!options.id) throw { ...message, id: messageId, text: 'Id of a column is required -> results will be stored by this key' }

  if (options.state) dispatch(setResultState(options.id, action));

  if (options.message) dispatch(sendMessage(null, { ...message, id: messageId, type: 'loading' }))

  // Run actual call
  // ===========================================================================
  return fetch(url, transformRequestData(data))
    // Throw error - if error message is presented
    // ===========================================================================
    .then((payload) => {
      if (payload.error) {
        dispatch(setResultState(options.id, 0));
        throw {
          id: messageId,
          payload: {
            text: payload.error,
            type: 'error'
          }
        }
      } else {
        return payload;
      }
    })
    // Display message if need and ensure that payload is actual data 
    // ===========================================================================
    .then((payload) => {
      let message = payload.success || payload.message;
      if (options.message) {
        dispatch(sendMessage(messageId, {
          type: 'success',
          text: (typeof options.message === 'string') ? options.message : message
        }));
      }
      return (message) ? data : payload;
    })
    // Create action Object
    // ===========================================================================
    .then((payload) => ({ type: (data.offset) ? ACTIONS['ADD_LINK'] : type, id: options.id, state: 2, payload }))
    .then(dispatch);
}

export const getResults = createResultAction(3, 'links', ACTIONS['GET_LINKS']);

export const refreshResult = createResultAction(3, 'links', ACTIONS['GET_LINK']);

export const ignoreResult = createResultAction(6, 'ignore', ACTIONS['IGNORE_LINK']);

export const favoriteResult = createResultAction(5, 'favorite', ACTIONS['FAVORITE_LINK']);

export const getAllResults = (data) => (dispatch) => {
  let columns;
  let ids = {};
  let messageId = moment().unix();

  // Pick exacly columns data to iterate over for Results fetching
  // ===========================================================================
  data.forEach((item) => {
    if (item && item.type === ACTIONS['GET_COLUMNS']) columns = item.payload;
  });


  // Create our [Top-level] Promise chain
  // ===========================================================================
  Promise.all(
    columns.map((column, i) => {
      // If column hidden - do nothing
      // ===========================================================================
      if (!column.open) return null;

      // Define time delay and set id to hash of columns being fetched
      // ===========================================================================
      let delay = (i > 4) ? i * 1200 : 0;
      ids[column.id] = true;

      // Promise wrapper around timeout
      // ===========================================================================
      return new Promise((resolve, reject) => {
        // Run our call and simple forward results to [Upper-level] promise chain
        // ===========================================================================
        setTimeout(() => dispatch(getResults(column.data, {
          id: column.id,
          message: false
        })).then(resolve).catch(reject), delay);
      }).then(() => {
        // When code is done - update our message by removing [ID] of column
        // wich result loading is done from list
        // ===========================================================================
        delete ids[column.id];
        return dispatch(sendMessage(messageId, {
          entityId: Object.keys(ids).join(',')
        }));
      });
    })
  ).then(() => dispatch(sendMessage(messageId, {
    visible: false
  }))).catch(err => dispatch(throwError(err)));

  // Send message at a start
  // ===========================================================================
  dispatch(sendMessage(null, {
    id: messageId,
    type: 'loading',
    entityId: Object.keys(ids).join(','),
    entity: 'results',
    action: 3
  }));
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
    (getUser) ? dispatch(createAction('user', 3)(null, {...opts, id: 'user'})) : null,
    dispatch(createAction('alerts', 3)(null, opts)),
    dispatch(createAction('reports', 3)(null, opts)),
    dispatch(createAction('sets', 3)(null, opts)),
    dispatch(createAction('sources', 3)(null, opts)),
    dispatch(createAction('columns', 3)({
      data: 1
    }, opts))
  ])
};