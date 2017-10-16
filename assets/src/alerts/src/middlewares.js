import types from './types';
import { parseOrder } from 'functions';

function processor(user) {
  return ({ order, ...alert }) => ({
    ...alert,
    order: parseOrder(order),
    recipient: alert.recipient || user.email
  });
}

export function processAlert({ getState }) {
  return next => (action) => {
    switch (action.type) {
      case types.READ:
        return next({
          ...action,
          payload: action.payload.map(processor(getState().user))
        });
      case types.CREATE:
      case types.UPDATE:
        return next({
          ...action,
          payload: processor(getState().user)(action.payload)
        });
      default:
        return next(action);
    }
  };
}
