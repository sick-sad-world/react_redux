import fetch from '../fetch';
import moment from 'moment';
import { notification } from '../redux/notifications';

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
      ...options
    };

    // Set user state to LOADING
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
          throw {
            id: (options.notification) ? notificationId : null,
            state: (options.state && config.state_type) ? config.state_type : null,
            text: payload.error || config.errorMessage.replace('$id', options.id),
            entity: options.id
          }
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
      });
  }
}