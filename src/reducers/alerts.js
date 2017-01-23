import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, REMOVE_ALERT } from '../actions/types';
import createReducer from '../helpers/reduserFactory';

export const alerts = createReducer({
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  DELETE: REMOVE_ALERT
});