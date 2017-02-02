import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT, SET_REPORT_STATE } from './types';
import createAction from './factory';

export const setReportsState = (state) => ({
  type: SET_REPORT_STATE,
  state
});

export const getReports = createAction({
  type: GET_REPORTS,
  state_type: SET_REPORT_STATE,
  url: 'reports',
  pendingMessage: 'Reading alerts data...',
  successMessage: 'Alerts data has been read.'
});