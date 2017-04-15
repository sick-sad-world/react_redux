import createAction from 'common/action-factory';
import types from '../types';

export const getColumns = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'columns',
  pendingMessage: 'Reading column data...',
  successMessage: 'Column data has been read.'
});

export const createColumn = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_column',
  pendingMessage: 'Creating new column...',
  successMessage: 'Column succesfully created.'
});

export const editColumn = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'column',
  pendingMessage: 'Updating column data...',
  successMessage: 'Column data has been updated.'
});

export const deleteColumn = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_column',
  pendingMessage: 'Deleting column...',
  successMessage: 'Column was deleted.'
});
