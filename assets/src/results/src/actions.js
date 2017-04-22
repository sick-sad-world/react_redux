import createAction from 'common/action-factory';
import types from './types';
import moment from 'moment';
import { notification } from 'src/notifications';

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

export function getAllResults(data) {
  return (dispatch) => {
    const ids = {};
    const LIMIT = 3;
    const DELAY = 1200;
    const notificationId = moment().unix();

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
          setTimeout(() => dispatch(getResults(column.data, {
            id: column.id,
            notification: false
          })).then(resolve).catch(reject), delay);
        }).catch((error) => {
          // Show error message if something went wrong
          // ===========================================================================
          if (notification) {
            dispatch(notification({
              type: 'error',
              text: `Results for column ${ids[column.id]} ended with error: ${(error.event) ? error.url : error.text}`
            }));
          }
        }).then(() => {
          // When code is done - update our message by removing [ID] of column
          // wich result loading is done from list
          // ===========================================================================
          delete ids[column.id];
          if (notification) {
            dispatch(notification({
              id: notificationId,
              type: 'loading',
              text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
            }));
          }
        });
      })
    ).then(() => {
      // Hide message when all columns are loaded
      // ===========================================================================
      if (notification) {
        dispatch(notification({
          id: notificationId,
          visible: false
        }));
      }
    });

    // Send message at a start
    // ===========================================================================
    if (notification) {
      dispatch(notification({
        id: notificationId,
        type: 'loading',
        text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
      }));
    }
  };
}