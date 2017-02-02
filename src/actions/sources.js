import { GET_SOURCES, ADD_SOURCE, EDIT_SOURCE, DELETE_SOURCE, SET_SOURCE_STATE } from './types';
import createAction from './factory';

export const setSourcesState = (state) => ({
  type: SET_SOURCE_STATE,
  state
});

export const getSources = createAction({
  type: GET_SOURCES,
  state_type: SET_SOURCE_STATE,
  url: 'sources',
  pendingMessage: 'Reading sources data...',
  successMessage: 'Sources data has been read.'
});