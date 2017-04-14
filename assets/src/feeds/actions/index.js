import createAction from 'common/action-factory';
import types from '../types';

export const setSourcesState = state => ({
  type: types.STATE,
  state
});

export const getSources = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'sources',
  pendingMessage: 'Reading sources data...',
  successMessage: 'Sources data has been read.'
});

export const createSource = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_source',
  pendingMessage: 'Creating new source...',
  successMessage: 'Source succesfully created.'
});

export const deleteSource = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_source',
  pendingMessage: 'Deleting source...',
  successMessage: 'Source was deleted.'
});
