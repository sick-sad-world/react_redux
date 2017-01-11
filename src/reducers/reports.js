import { GET_REPORTS, SET_REPORT_STATE, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from '../actions/types';
import basicReducer from '../helpers/reducer-factory'

export const reports = basicReducer({
  STATE: SET_REPORT_STATE,
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  DELETE: DELETE_REPORT
});