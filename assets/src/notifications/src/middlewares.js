import { notification } from '../actions';

export const sendMessage = function sendMessage({ dispatch, getState }) {
  return next => (action) => {
    if (action.message) {
      dispatch(notification(action.message));
    }
    return next(action);
  };
};
