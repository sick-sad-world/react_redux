import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, REMOVE_REPORT } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';

export const reports = basicReducer({
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  DELETE: REMOVE_REPORT
});