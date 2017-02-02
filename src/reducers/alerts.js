import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, REMOVE_ALERT, SET_ALERT_STATE } from '../actions/types';
import createReducer from '../helpers/reducerFactory';

export default createReducer({
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  DELETE: REMOVE_ALERT,
  STATE: SET_ALERT_STATE
});