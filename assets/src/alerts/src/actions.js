import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getAlerts = createAction({
  action: types.READ,
  loading: types.STATE,
  call: 'alerts'
});

export const sortAlerts = createAction({
  action: types.SORT,
  loading: types.STATE,
  call(data, opts) {
    return fetch('sort_alerts', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createAlert = createAction({
  action: types.CREATE,
  loading: types.STATE,
  call: 'add_alert'
});

export const editAlert = createAction({
  action: types.UPDATE,
  loading: types.STATE,
  call: 'alert'
});

export const deleteAlert = createAction({
  action: types.DELETE,
  loading: types.STATE,
  call(data, opts) {
    return fetch('remove_alert', data, opts).then(resp => (resp.success) ? data : resp);
  }
});
