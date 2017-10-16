import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getAlerts = createAction({
  action: types.READ,
  call: 'alerts'
});

export const sortAlerts = createAction({
  action: types.SORT,
  call(data, opts) {
    return fetch('sort_alerts', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createAlert = createAction({
  action: types.CREATE,
  call: 'add_alert'
});

export const editAlert = createAction({
  action: types.UPDATE,
  call: 'alert'
});

export const deleteAlert = createAction({
  action: types.DELETE,
  call(data, opts) {
    return fetch('remove_alert', data, opts).then(resp => (resp.success) ? data : resp);
  }
});
