import createAction from 'common/action-factory';
import types from './types';

export const setSetsState = state => ({
  type: types.STATE,
  state
});

export const getSets = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'sets',
  pendingMessage: 'Reading set data...',
  successMessage: 'Sourceset data has been read.'
});

export const sortSets = createAction({
  type: types.SORT,
  state_type: types.STATE,
  url: 'sort_sets',
  pendingMessage: 'Saving new Sets order...',
  successMessage: 'Sets order has been read.'
});

export const createSet = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_set',
  pendingMessage: 'Creating new set...',
  successMessage: 'Set succesfully created.'
});

export const editSet = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'set',
  pendingMessage: 'Updating set data...',
  successMessage: 'Set data has been updated.'
});

export const deleteSet = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_set',
  pendingMessage: 'Deleting set...',
  successMessage: 'Set was deleted.'
});

export const forseUpdateUniq = () => dispatch => dispatch({
  type: types.UPDATE_UNIQ
});
