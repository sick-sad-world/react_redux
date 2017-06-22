import createAction from 'common/action-factory';
import types from './types';
import moment from 'moment';

export const getResults = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Fetching results for $id column...',
  successMessage: 'Results fetched successfully.'
});

export const addResults = createAction({
  type: types.PUSH,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Fetching more results for $id column...',
  successMessage: 'Results added successfully.'
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

export const refreshResult = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Refreshing result $id...',
  successMessage: 'Result updated.'
});

export const ignoreResult = createAction({
  type: types.IGNORE,
  state_type: types.STATE,
  url: 'ignore',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result ignorance changed.'
});

export const favoriteResult = createAction({
  type: types.FAVORITE,
  state_type: types.STATE,
  url: 'favorite',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result favor changed.'
});

export function fetchResults(data, opts) {
  return dispatch => dispatch((data.offset) ? addResults(data, opts) : getResults(data, opts)).catch(() => dispatch(resultError(null, opts.entity)));
}

export function getAllResults(data) {
  return (dispatch, getState, { notification }) => {
    const ids = {};
    const LIMIT = 3;
    const DELAY = 1200;
    const noteId = moment().unix();
    const timeouts = [];

    const endSequence = () => {
      if (notification) {
        dispatch(notification({
          id: noteId,
          visible: false
        }));
      }
      timeouts.forEach(clearTimeout);
    };

    const stepMessage = (id) => {
      if (id) delete ids[id];
      if (notification) {
        dispatch(notification({
          id: noteId,
          type: 'loading',
          text: `Results for columns ${Object.keys(ids).join(', ')} downloading now...`
        }));
      }
    };

    // Create our [Top-level] Promise chain
    // ===========================================================================
    Promise.all(
      data.map((column, i) => {
        // If column hidden - do nothing
        // ===========================================================================
        if (!column.open) return null;

        // Define time delay and set id to hash of columns being fetched
        // ===========================================================================
        const delay = (i > LIMIT) ? (i - LIMIT) * DELAY : 0;
        ids[column.id] = true;

        // Promise wrapper around timeout
        // ===========================================================================
        return new Promise((resolve, reject) => {
          // Run our call and simple forward results to [Upper-level] promise chain
          // ===========================================================================
          timeouts.push(setTimeout(() => {
            if (!getState().user.payload.id) return endSequence();
            return dispatch(getResults(column.data, {
              entity: column.id,
              notification: false,
              state: false
            })).then((payload) => {
              if (!getState().user.payload.id) return null;
              stepMessage(column.id);
              resolve(payload);
            }).catch((...args) => {
              if (!getState().user.payload.id) return null;
              const text = `Results for column ${column.id} ended with error`;
              if (notification) dispatch(notification({ type: 'error', text }));
              dispatch(resultError(text, column.id));
              reject(...args);
            });
          }, delay));
        });
      })
    ).catch(console.warn).then(endSequence);

    stepMessage();
  };
}
