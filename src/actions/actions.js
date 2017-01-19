// Import action types and our communication helper
// ===========================================================================
import * as ACTIONS from './types';
import { reduce, isPlainObject, omitBy, isUndefined, keys } from 'lodash';
import fetch from '../fetch';
import moment from 'moment';

// Action constructor (for default AJAX comunnication)
// Since most of our actions are the same - i create this
// ===========================================================================
export const createAction = (entity, action) => (data, options) => (dispatch) => {

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
  }, {
    id
  });

  switch (action) {
    case 3:
      if (entity === 'user') {
        url = 'user';
        type = ACTIONS['GET_USER'];
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
        text: payload.error
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
export const createResultAction = (action) => (data, options) => (dispatch) => {

  let url;
  let type;

  let messageId = moment().unix();

  let opts = Object.assign({
    id: null,
    message: true,
    state: true
  }, options);

  if (!opts.id) {
    throw {
      id: messageId,
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
      type = ACTIONS['DELETE_LINK'];
      break;
    default:
      url = 'links';
      type = (data.offset) ? ACTIONS['ADD_LINKS'] : ACTIONS['GET_LINKS'];
      break;
  }

  // Set state to loading
  // ===========================================================================
  if (opts.state) {
    dispatch({
      state: action,
      type: ACTIONS['LINKS_STATE'],
      id: opts.id
    });
  }

  if (opts.message) {
    dispatch(sendMessage({
      type: 'loading',
      id: messageId,
      entityId: opts.id,
      entity: 'results',
      action: action
    }))
  }

  // Run actual call
  // ===========================================================================
  return fetch(url, omitBy(data, isUndefined)).then((payload) => {
    if (opts.message) {
      dispatch(sendMessage({
        type: 'success',
        entityId: opts.id,
        entity: 'results',
        action: action
      }, messageId))
    }
    dispatch({
      type: type,
      id: opts.id,
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
    (getUser) ? dispatch(createAction('user', 3)(null, opts)) : null,
    dispatch(createAction('alert', 3)(null, opts)),
    dispatch(createAction('report', 3)(null, opts)),
    dispatch(createAction('set', 3)(null, opts)),
    dispatch(createAction('source', 3)(null, opts)),
    dispatch(createAction('column', 3)({
      data: 1
    }, opts))
  ])
};