import createAction from 'common/action-factory';
import types from './types';

export const setFeedesState = state => ({
  type: types.STATE,
  state
});

export const getFeedes = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'sources',
  pendingMessage: 'Reading sources data...',
  successMessage: 'Sources data has been read.'
});

export const createFeed = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_source',
  pendingMessage: 'Creating new source...',
  successMessage: 'Source succesfully created.'
});

export const deleteFeed = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_source',
  pendingMessage: 'Deleting source...',
  successMessage: 'Source was deleted.'
});
