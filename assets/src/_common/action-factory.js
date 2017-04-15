import moment from 'moment';
import fetch from '../communication';

export default function createAction(conf) {
  const config = {
    url: null,
    type: null,
    state_type: null,
    successMessage: null,
    pendingMessage: null,
    errorMessage: null,
    ...conf
  };

  return (data, opts) => (dispatch, getState, appActions) => {
    const notificationId = moment().unix();
    const options = {
      notification: true,
      state: true,
      id: (data) ? data.id : null,
      ...opts
    };

    // Set entity state to LOADING
    // ===========================================================================
    if (options.state && config.state_type) {
      dispatch({
        type: config.state_type,
        state: 3,
        entity: options.id
      });
    }

    // Create notification of process beginning
    // ===========================================================================
    if (options.notification && config.pendingMessage) {
      dispatch(appActions.notification({
        id: notificationId,
        type: 'loading',
        text: config.pendingMessage.replace('$id', options.id)
      }));
    }

    // Run actual call
    // ===========================================================================
    return fetch(config.url, data)
      .then((payload) => {
        if (payload.error) {
          throw {
            text: payload.error || config.errorMessage.replace('$id', options.id)
          };
        }
        return payload;
      })
      .then((payload) => {
        // Create notification of process successfull ending
        // ===========================================================================
        if (options.notification) {
          dispatch(appActions.notification({
            id: notificationId,
            type: 'success',
            text: payload.success || config.successMessage.replace('$id', options.id)
          }));
        }

        // Dispatch actual action with data provided
        // ===========================================================================
        return dispatch({
          type: config.type,
          payload: (payload.success || payload.message) ? data : payload,
          entity: options.id
        });
      })
      .catch((error) => {
        if (error instanceof Error) {
          // Dispatch global app Error
          // ===========================================================================
          dispatch(appActions.clientError(error.trace));
        } else {
          // Dispatch error notification
          // ===========================================================================
          if (options.notification) {
            dispatch(appActions.notification({
              id: notificationId,
              type: 'error',
              text: (error.event) ? `Network error: ${error.url}` : error.text
            }));
          }

          // Set entity state to IDLE
          // ===========================================================================
          if (options.state && config.state_type) {
            dispatch({
              type: config.state_type,
              state: 2
            });
          }
        }

        throw error;
      });
  };
}
