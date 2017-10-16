import types from './types';
import { parseOrder } from 'functions';

function processor(user) {
  return ({ order, ...report }) => ({
    ...report,
    order: parseOrder(order),
    recipient: report.recipient || user.email
  });
}

export function processReport({ getState }) {
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
