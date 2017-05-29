import createAction from 'common/action-factory';
import types from './types';

export const getResultMeasurements = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'graphdata',
  pendingMessage: 'Fetching result data to build graphs'
});

export const graphError = error => dispatch => dispatch({ type: types.ERROR, error });

export const clearGraphData = () => dispatch => dispatch({ type: types.DELETE });
