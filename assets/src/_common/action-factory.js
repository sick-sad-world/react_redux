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

  return (data, opts) => (dispatch, getState, { notification, clientError }) => {
    const notificationId = moment().unix();
    const options = {
      notification: true,
      state: true,
      entity: (data && data.id) ? data.id : null,
      ...opts
    };

    // Set entity state to LOADING
    // ===========================================================================
    if (options.state && config.state_type) {
      dispatch({
        type: config.state_type,
        state: 3,
        entity: options.entity
      });
    }

    // Create notification of process beginning
    // ===========================================================================
    if (notification && options.notification && config.pendingMessage) {
      dispatch(notification({
        id: notificationId,
        type: 'loading',
        text: config.pendingMessage.replace('$id', options.entity)
      }));
    }

    // Run actual call
    // ===========================================================================
    return fetch(config.url, data)
      .then((payload) => {
        if (payload.error) {
          throw {
            text: payload.error || config.errorMessage.replace('$id', options.entity)
          };
        }
        return payload;
      })
      .then((payload) => {
        // Create notification of process successfull ending
        // ===========================================================================
        if (notification && options.notification) {
          dispatch(notification({ id: notificationId, visible: false }));
        }

        // Dispatch actual action with data provided
        // ===========================================================================
        return dispatch({
          type: config.type,
          payload: (payload.success || payload.message) ? data : payload,
          entity: options.entity
        });
      })
      .catch((error) => {
        if (error instanceof Error) {
          // Dispatch global app Error
          // ===========================================================================
          if (clientError) {
            dispatch(clientError(error.trace));
          }
        } else {
          // Dispatch error notification
          // ===========================================================================
          if (notification && options.notification) {
            dispatch(notification({
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
