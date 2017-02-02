import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, REMOVE_REPORT, SET_REPORT_STATE } from '../actions/types';
import createReducer from '../helpers/reducerFactory';

export default createReducer({
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  DELETE: REMOVE_REPORT,
  STATE: SET_REPORT_STATE
});