import types from '../types';

export default ({ dispatch, getState }) => next => (action) => {
  if (action.type === types.UPDATE) {
    action.payload.sources = undefined;
  }
  return next(action);
};
