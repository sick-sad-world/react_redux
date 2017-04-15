import moment from 'moment';
import { getResults } from '../actions';
import { notification } from 'src/notifications/actions';

export default data => (dispatch) => {
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
      }).catch(error =>
        // Show error message if something went wrong
        // ===========================================================================
         dispatch(notification({
           type: 'error',
           text: `Results for column ${ids[column.id]} ended with error: ${(error.event) ? error.url : error.text}`
         }))).then(() => {
        // When code is done - update our message by removing [ID] of column
        // wich result loading is done from list
        // ===========================================================================
           delete ids[column.id];
           return dispatch(notification({
             id: notificationId,
             type: 'loading',
             text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
           }));
         });
    })
  ).then(() => dispatch(notification({
    id: notificationId,
    visible: false
  })));

  // Send message at a start
  // ===========================================================================
  dispatch(notification({
    id: notificationId,
    type: 'loading',
    text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
  }));
};
