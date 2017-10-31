import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getColumns = createAction({
  action: types.READ,
  call: 'columns'
});

export const sortColumns = createAction({
  action: types.SORT,
  call(data, opts) {
    return fetch('sort_columns', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createColumn = createAction({
  action: types.CREATE,
  call: 'add_column'
});

export const editColumn = createAction({
  action: types.UPDATE,
  call(data, opts) {
    return fetch('column', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const updateVisibility = createAction({
  action: types.UPD_VIS,
  call(data, opts) {
    return fetch('column', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const deleteColumn = createAction({
  action: types.DELETE,
  call(data, opts) {
    return fetch('remove_column', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

