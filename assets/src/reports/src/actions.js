import createAction from 'common/action-factory';
import types from '../types';

export const setReportsState = state => ({
  type: types.STATE,
  state
});

export const getReports = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'reports',
  pendingMessage: 'Reading reports data...',
  successMessage: 'Reports data has been read.'
});

export const createReport = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_report',
  pendingMessage: 'Creating new report...',
  successMessage: 'Report succesfully created.'
});

export const editReport = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'report',
  pendingMessage: 'Updating report data...',
  successMessage: 'Report data has been updated.'
});

export const deleteReport = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_report',
  pendingMessage: 'Deleting report...',
  successMessage: 'Report was deleted.'
});
