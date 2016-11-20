import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from "../actions/types";
import basicReducer from "./reducerFactory"

export let alerts = basicReducer({
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  DELETE: DELETE_ALERT
});