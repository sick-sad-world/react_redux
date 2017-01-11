import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';

export const reports = basicReducer({
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  DELETE: DELETE_REPORT
});