import types from './types';

function processor(user) {
  return report => ({
    ...report,
    order: parseInt(report.order, 10) || -1,
    recipient: report.recipient || user.email
  });
}

export function processReport({ getState }) {
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
