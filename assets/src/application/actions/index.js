import types from '../types';

export { fetchData } from './fetchData';

export const clientError = error => dispatch => dispatch({
  type: types.ERROR,
  error: (error instanceof Error) ? error.stack : error
});

export const setAppState = state => dispatch => dispatch({
  type: types.STATE,
  state
});
