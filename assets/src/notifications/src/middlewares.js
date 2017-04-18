import { notification } from './actions';

export function sendMessage({ dispatch, getState }) {
  return next => (action) => {
    if (action.message) {
      dispatch(notification(action.message));
    }
    return next(action);
  };
}
