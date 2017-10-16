import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getReports = createAction({
  action: types.READ,
  call: 'reports'
});

export const sortReports = createAction({
  action: types.SORT,
  call(data, opts) {
    return fetch('sort_reports', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createReport = createAction({
  action: types.CREATE,
  call: 'add_report'
});

export const editReport = createAction({
  action: types.UPDATE,
  call: 'report'
});

export const deleteReport = createAction({
  action: types.DELETE,
  call(data, opts) {
    return fetch('remove_report', data, opts).then(resp => (resp.success) ? data : resp);
  }
});
