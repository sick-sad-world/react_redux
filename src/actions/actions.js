// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import { keys } from 'lodash';
import { compileRequstParams, transformRequestData, createMessage, transformError } from '../helpers/functions';
import fetch from '../fetch';
import moment from 'moment';

// Set app state (simple and SYNC)
// ===========================================================================
export const setAppState = (state) => ({
  type: ACTIONS['SET_APP_STATE'],
  state
});

// Throw action related to error (SYNC)
// ===========================================================================
export const throwError = (error) => (dispatch) => {
  let action = {
    type: ACTIONS['ERROR'],
    payload: createMessage(transformError(error))
  };
  if (error.id) {
    action.id = error.id;
    delete action.payload.id;
  } 
  dispatch(action);
};

// Create or edit message in system notification module
// ===========================================================================
export const sendMessage = (data, id) => {
  if (id) {
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
    id: (data) ? data.id : null
  }, options);

  let messageId = moment().unix();
  let url;
  let type;

  switch (action) {
    case 3:
      if (options.id) {
        url = entity;
        type = ACTIONS[`GET_${entity.toUpperCase()}`];
      } else {
        url = entity + 's';
        type = ACTIONS[`GET_${entity.toUpperCase()}S`];
      }
      break;
    case 4:
      url = 'add_' + entity;
      type = ACTIONS[`ADD_${entity.toUpperCase()}`];
      break;
    case 5:
      url = entity;
      type = ACTIONS[`EDIT_${entity.toUpperCase()}`];
      break;
    case 6:
      url = 'remove_' + entity;
      type = ACTIONS[`REMOVE_${entity.toUpperCase()}`];
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
      throw {
        text: 'Action code incorrect. Should be between 3 and 8'
      }
  }

  // Set app state to [loading]
  // ===========================================================================
  if (options.state) {
    dispatch({
      type: ACTIONS['SET_APP_STATE'],
      state: action
    });
  }

  // Send message
  // ===========================================================================
  if (options.message) {
    dispatch(sendMessage({
      id: messageId,
      type: 'loading',
      entity,
      action,
      entityId: options.id
    }));
  }

  // Fire a call to server
  // ===========================================================================
  return fetch(url, transformRequestData(data, options.id)).then(payload => {

    // Set app state to idle
    // ===========================================================================
    if (options.state) {
      dispatch({
        type: ACTIONS['SET_APP_STATE'],
        state: 2
      });
    }

    // Fire [error] action if error found
    // ===========================================================================
    if (payload.error) {
      throw {
        id: messageId,
        entity,
        action,
        entityId: options.id,
        text: payload.error
      };
    }

    // Fire message to display proper message if responce contains only it
    // ===========================================================================
    if (options.message) {
      dispatch(sendMessage({
        type: 'success',
        text: (payload) ? payload.success : options.message
      }, messageId));
    }

    if (payload.message || payload.success) {
      payload = data;
    }

    // Dispatch proper action
    // ===========================================================================
    if (payload) {
      delete payload.callback;
    }
    return dispatch({
      type,
      payload,
      id: options.id
    });
  });
}

// Get results for a single column
// @data - column data Object required
// ===========================================================================
export const createResultAction = (action) => (data, options) => (dispatch) => {

  let url;
  let type;
  let entity = 'result';

  let messageId = moment().unix();

  options = Object.assign({
    id: null,
    message: true,
    state: true
  }, options);

  if (!options.id) {
    throw {
      entityId: options.id,
      error: 'Id of a column is required -> results will be stored by this key'
    }
  }

  switch (action) {
    case 8:
      url = 'refresh_links';
      type = ACTIONS['GET_LINK'];
      break;
    case 5:
      url = 'favorite';
      type = ACTIONS['EDIT_LINK'];
      break;
    case 6:
      url = 'ignore';
      type = ACTIONS['REMOVE_LINK'];
      break;
    default:
      url = 'links';
      type = (data.offset) ? ACTIONS['ADD_LINKS'] : ACTIONS['GET_LINKS'];
      entity += 's';
      break;
  }

  // Set state to loading
  // ===========================================================================
  if (options.state) {
    dispatch({
      state: action,
      type: ACTIONS['LINKS_STATE'],
      id: options.id
    });
  }

  if (options.message) {
    dispatch(sendMessage({
      type: 'loading',
      id: messageId,
      entityId: (url === 'links') ? options.id : data.hash,
      entity,
      action
    }))
  }

  // Run actual call
  // ===========================================================================
  return fetch(url, transformRequestData(data)).then((payload) => {
    if (options.message) {
      dispatch(sendMessage({
        type: 'success',
        entityId: (url === 'links') ? options.id : data.hash,
        entity,
        action
      }, messageId))
    }
    dispatch({
      type: type,
      id: options.id,
      state: 2,
      payload
    });
  });
}

// Get results for all columns with a time delay
// ===========================================================================
export const getAllResults = (data) => (dispatch) => {
  let columns;
  let ids = {};
  let messageId = moment().unix();
  let getResults = createResultAction(3);

  // Pick exacly columns data to iterate over for Results fetching
  // ===========================================================================
  data.forEach((item) => {
    if (item && item.type === ACTIONS['GET_COLUMNS']) {
      columns = item.payload;
    }
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
        return dispatch(sendMessage({
          entityId: keys(ids).join(',')
        }, messageId));
      });
    })
  ).then(() => dispatch(sendMessage({
    visible: false
  }, messageId))).catch(err => dispatch(throwError(err)));

  // Send message at a start
  // ===========================================================================
  dispatch(sendMessage({
    id: messageId,
    type: 'loading',
    entityId: keys(ids).join(','),
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
    dispatch(createAction('alert', 3)(null, opts)),
    dispatch(createAction('report', 3)(null, opts)),
    dispatch(createAction('set', 3)(null, opts)),
    dispatch(createAction('source', 3)(null, opts)),
    dispatch(createAction('column', 3)({
      data: 1
    }, opts))
  ])
};