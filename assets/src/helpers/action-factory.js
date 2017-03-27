import fetch from '../fetch';
import moment from 'moment';
import { notification } from '../redux/notifications';
import { clientError } from '../redux/app';

export default function createAction (config) {

  config = {
    url: null,
    type: null,
    state_type: null,
    successMessage: null,
    pendingMessage: null,
    errorMessage: null,
    ...config
  };

  return (data, options) => (dispatch) => {
    const notificationId = moment().unix();
    options = {
      notification: true,
      state: true,
      id: (data) ? data.id : null,
      ...options
    };

    // Set entity state to LOADING
    // ===========================================================================
    if (options.state && config.state_type) dispatch({
      type: config.state_type,
      state: 3,
      entity: options.id
    });

    // Create notification of process beginning
    // ===========================================================================
    if (options.notification && config.pendingMessage) dispatch(notification({
      id: notificationId,
      type: 'loading',
      text: config.pendingMessage.replace('$id', options.id)
    }));

    // Run actual call
    // ===========================================================================
    return fetch(config.url, data)
      .then((payload) => {
        if (payload.error) {
          throw { text: payload.error || config.errorMessage.replace('$id', options.id) }
        }
        return payload;
      })
      .then((payload)=>{
        // Create notification of process successfull ending
        // ===========================================================================
        if (options.notification) dispatch(notification({
          id: notificationId,
          type: 'success',
          text: payload.success || config.successMessage.replace('$id', options.id)
        }));

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
          dispatch(clientError(error.trace));
        } else {
          // Dispatch error notification
          // ===========================================================================
          if (options.notification) dispatch(notification({
            id: notificationId,
            type: 'error',
            text: (error.event) ? `Network error: ${error.url}` : error.text
          }));

          // Set entity state to IDLE
          // ===========================================================================
          if (options.state && config.state_type) dispatch({
            type: config.state_type,
            state: 2
          })
        }

        throw error;
      })
  }
}