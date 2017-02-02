import { GET_SETS, ADD_SET, EDIT_SET, DELETE_SET, SET_SET_STATE } from './types';
import createAction from './factory';

export const setSetsState = (state) => ({
  type: SET_SET_STATE,
  state
});

export const getSets = createAction({
  type: GET_SETS,
  state_type: SET_SET_STATE,
  url: 'sets',
  pendingMessage: 'Reading set data...',
  successMessage: 'Sourceset data has been read.'
});