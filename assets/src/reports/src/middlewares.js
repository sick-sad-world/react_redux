import types from './types';

function processor(user) {
  return report => ({
    ...report,
    order: parseInt(report.order, 10) || -1,
    recipient: report.recipient || user.email
  });
}

export function processReport({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      return next({
        ...action,
        payload: action.payload.map(processor(getState().user.payload))
      });
    } else if (action.type === types.CREATE) {
      return next({
        ...action,
        payload: processor(getState().user.payload)(action.payload)
      });
    }

    return next(action);
  };
}
