import createAction from 'common/action-factory';
import types from '../types';

export { getAllResults } from './getAllResults';

export const getResults = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Fetching results for $id column...',
  successMessage: 'Results fetched successfully.'
});

export const addResults = createAction({
  type: types.PUSH,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Fetching more results for $id column...',
  successMessage: 'Results added successfully.'
});

export const refreshResult = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'links',
  pendingMessage: 'Refreshing result $id...',
  successMessage: 'Result updated.'
});

export const ignoreResult = createAction({
  type: types.IGNORE,
  state_type: types.STATE,
  url: 'ignore',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result ignorance changed.'
});

export const favoriteResult = createAction({
  type: types.FAVORITE,
  state_type: types.STATE,
  url: 'favorite',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result favor changed.'
});
