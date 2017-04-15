import { notification } from '../actions';

export default ({ dispatch, getState }) => next => (action) => {
  if (action.message) {
    dispatch(notification(action.message));
  }
  return next(action);
};
