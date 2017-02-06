import { GET_SOURCES, ADD_SOURCE, REMOVE_SOURCE, SET_SOURCE_STATE } from '../helpers/types';
import createReducer from '../helpers/reducerFactory';
import createAction from '../helpers/actionFactory';

export default createReducer({
  GET: GET_SOURCES,
  ADD: ADD_SOURCE,
  REMOVE: REMOVE_SOURCE,
  STATE: SET_SOURCE_STATE
});


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

export const createReport = createAction({
  type: ADD_SOURCE,
  state_type: SET_SOURCE_STATE,
  url: 'add_source',
  pendingMessage: 'Creating new source...',
  successMessage: 'Source succesfully created.'
});

export const deleteReport = createAction({
  type: REMOVE_SOURCE,
  state_type: SET_SOURCE_STATE,
  url: 'remove_source',
  pendingMessage: 'Deleting source...',
  successMessage: 'Source was deleted.'
});