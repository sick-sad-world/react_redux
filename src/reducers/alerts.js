import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, REMOVE_ALERT } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';

export const alerts = basicReducer({
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  DELETE: REMOVE_ALERT
});