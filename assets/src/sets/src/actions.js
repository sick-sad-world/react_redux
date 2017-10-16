import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';

export const getSets = createAction({
  action: types.READ,
  call: 'sets'
});

export const sortSets = createAction({
  action: types.SORT,
  call(data, opts) {
    return fetch('sort_sets', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const createSet = createAction({
  action: types.CREATE,
  call: 'add_set'
});

export const editSet = createAction({
  action: types.UPDATE,
  call: 'set'
});

export const deleteSet = createAction({
  action: types.DELETE,
  call(data, opts) {
    return fetch('remove_set', data, opts).then(resp => (resp.success) ? data : resp);
  }
});

export const forseUpdateUniq = dispatch => dispatch({
  type: types.UPDATE_UNIQ
});
