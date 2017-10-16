import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getReports = createAction({
  action: types.READ,
  loading: types.STATE,
  call: 'reports'
});

export const sortReports = createAction({
  action: types.SORT,
  loading: types.STATE,
  call(data, opts) {
    return fetch('sort_reports', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createReport = createAction({
  action: types.CREATE,
  loading: types.STATE,
  call: 'add_report'
});

export const editReport = createAction({
  action: types.UPDATE,
  loading: types.STATE,
  call: 'report'
});

export const deleteReport = createAction({
  action: types.DELETE,
  loading: types.STATE,
  call(data, opts) {
    return fetch('remove_report', data, opts).then(resp => (resp.success) ? data : resp);
  }
});
