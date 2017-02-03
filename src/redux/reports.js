import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, REMOVE_REPORT, SET_REPORT_STATE } from '../helpers/types';
import createReducer from '../helpers/reducerFactory';
import createAction from '../helpers/actionFactory';

export default createReducer({
  GET: GET_REPORTS,
  ADD: ADD_REPORT,
  EDIT: EDIT_REPORT,
  REMOVE: REMOVE_REPORT,
  STATE: SET_REPORT_STATE
});

export const setReportsState = (state) => ({
  type: SET_REPORT_STATE,
  state
});

export const getReports = createAction({
  type: GET_REPORTS,
  state_type: SET_REPORT_STATE,
  url: 'reports',
  pendingMessage: 'Reading reports data...',
  successMessage: 'Alerts data has been read.'
});

export const createReport = createAction({
  type: ADD_REPORT,
  state_type: SET_REPORT_STATE,
  url: 'add_report',
  pendingMessage: 'Creating new report...',
  successMessage: 'Report succesfully created.'
});

export const editReport = createAction({
  type: EDIT_REPORT,
  state_type: SET_REPORT_STATE,
  url: 'report',
  pendingMessage: 'Updating report data...',
  successMessage: 'Report data has been updated.'
});

export const deleteReport = createAction({
  type: REMOVE_REPORT,
  state_type: SET_REPORT_STATE,
  url: 'remove_report',
  pendingMessage: 'Deleting report...',
  successMessage: 'Report was deleted.'
});