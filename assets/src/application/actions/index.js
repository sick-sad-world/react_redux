import types from '../types';
import fetchData from './fetch-data';

export { fetchData };

export const clientError = error => dispatch => dispatch({
  type: types.ERROR,
  error: (error instanceof Error) ? error.stack : error
});

export const setAppState = state => dispatch => dispatch({
  type: types.STATE,
  state
});
