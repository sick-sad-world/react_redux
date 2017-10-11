import types from './types';

function processor(user) {
  return alert => ({
    ...alert,
    order: parseInt(alert.order, 10) || -1,
    recipient: alert.recipient || user.email
  });
}

export function processAlert({ getState }) {
  return next => (action) => {
    switch (action.type) {
      case types.READ:
        return next({
          ...action,
          payload: action.payload.map(processor(getState().user.payload))
        });
      case types.CREATE:
      case types.UPDATE:
        return next({
          ...action,
          payload: processor(getState().user.payload)(action.payload)
        });
      default:
        return next(action);
    }
  };
}
