import { GET_ALERTS, SET_ALERTS_STATE, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from '../actions/types';
import basicReducer from '../helpers/reducer-factory'

export const alerts = basicReducer({
  STATE: SET_ALERTS_STATE,
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  DELETE: DELETE_ALERT
});