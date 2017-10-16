import { omit } from 'lodash';
import fetch from '../communication';

export default function createAction({ call, action, loading }) {
  return (data, options) => (dispatch, getState, { notification, clientError }) => {
    const { entity, ...opts } = options || {};

    // Run actual call
    // ===========================================================================
    return (typeof call === 'string' ? fetch(call, data, opts) : call(data, opts))

      // Filter data from server messages, or errors
      // ===========================================================================
      .then((payload) => {
        if (typeof payload.error === 'string') {
          throw { error: payload.error };
        } else {
          return (Array.isArray(payload)) ? payload : omit(payload, 'message', 'success', 'error');
        }
      })
      // Dispatch actual action with data provided
      // ===========================================================================
      .then(payload => dispatch({ type: action, payload, entity }))
      // Handle error and pass in chain
      // ===========================================================================
      .catch((error) => {
        if (error instanceof Error && clientError) {
          // Dispatch global app Error
          // ===========================================================================
          dispatch(clientError(error));
        } else if (error && notification && !opts.silent) {
          // Dispatch error notification
          // ===========================================================================
          dispatch(notification({
            id: Date.now(),
            type: 'error',
            text: (error.event) ? `Network error: ${error.url}` : error.error
          }));
        }
        throw error;
      });
  };
}
