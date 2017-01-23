import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, REMOVE_REPORT } from '../actions/types';
import createReducer from '../helpers/reduserFactory';

export const reports = createReducer({
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  DELETE: REMOVE_REPORT
});