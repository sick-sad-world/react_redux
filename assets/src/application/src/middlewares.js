import { LOGOUT } from './types';
import { cancelAll } from 'src/communication';

export function cancelAllCallsOnLogout({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === LOGOUT) cancelAll();
    return next(action);
  };
}
