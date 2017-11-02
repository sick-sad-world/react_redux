import { get } from 'lodash';
import createAction from 'common/action-factory';
import types from './types';
import moment from 'moment';

export const setResultState = ({ state, entity }) => dispatch => dispatch({
  type: types.STATE,
  state,
  entity
});

export const clearResults = entity => dispatch => dispatch({
  type: types.DELETE,
  entity
});

export const resultError = (error, entity) => dispatch => dispatch({
  type: types.ERROR,
  entity,
  error: (typeof error === 'string') ? error : `Results for column ${entity} ended with error`
});

export const getResults = createAction({
  action: types.READ,
  call: 'links'
});

export const addResults = createAction({
  action: types.PUSH,
  call: 'links'
});

export const refreshResult = createAction({
  action: types.UPDATE,
  call: 'links'
});

export const ignoreResult = createAction({
  action: types.IGNORE,
  call: 'ignore'
});

export const favoriteResult = createAction({
  action: types.FAVORITE,
  call: 'favorite'
});

export function fetchResults(data, opts) {
  return dispatch => dispatch((data.offset) ? addResults(data, opts) : getResults(data, opts)).catch(() => dispatch(resultError(null, opts.entity)));
}

export function getAllResults(data) {
  return (dispatch, getState, { notification }) => {
    const items = data.filter(({ open }) => open);
    let count = items.length;
    const LIMIT = 3;
    const DELAY = 1200;
    const noteId = moment().unix();
    const timeouts = [];

    const endSequence = () => {
      if (notification && items.length > LIMIT) {
        dispatch(notification({
          id: noteId,
          visible: false
        }));
      }
      timeouts.forEach(clearTimeout);
    };

    const stepMessage = (visible = (getState().notifications.find(({ id }) => id === noteId) || {}).visible) => {
      if (notification && items.length > LIMIT && visible) {
        dispatch(notification({
          id: noteId,
          type: 'loading',
          text: `Loading data for ${count} columns, stand by...`
        }));
      }
    };

    // Create our [Top-level] Promise chain
    // ===========================================================================
    Promise.all(
      items.map((column, i) => {
        // If column hidden - do nothing
        // ===========================================================================
        if (!column.open) return null;

        // Define time delay and set id to hash of columns being fetched
        // ===========================================================================
        const delay = (i > LIMIT) ? (i - LIMIT) * DELAY : 0;

        // Promise wrapper around timeout
        // ===========================================================================
        return new Promise((resolve, reject) => {
          // Run our call and simple forward results to [Upper-level] promise chain
          // ===========================================================================
          timeouts.push(setTimeout(() => {
            if (!get(getState(), 'user.id', false)) return endSequence();
            return dispatch(getResults(column.data, { entity: column.id }))
              .then((payload) => {
                if (get(getState(), 'user.id', false)) {
                  count -= 1;
                  stepMessage();
                  resolve(payload);
                }
              })
              .catch((...args) => {
                if (get(getState(), 'user.id', false)) {
                  count -= 1;
                  // const text = `Results for column ${column.id} ended with error`;
                  // if (notification) dispatch(notification({ type: 'error', text }));
                  dispatch(resultError(null, column.id));
                  reject(...args);
                }
              });
          }, delay));
        });
      })
    ).catch(console.warn).then(endSequence);

    stepMessage(true);
  };
}
