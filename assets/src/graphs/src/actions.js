import createAction from 'common/action-factory';
import types from './types';
import { fetchScript } from 'src/communication';

export const getResultMeasurements = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'graphdata',
  pendingMessage: 'Fetching result data to build graphs'
});

export const fetchGoogleGraphs = () => fetchScript('https://www.gstatic.com/charts/loader.js')
  .then(() => {
    window.google && window.google.charts.load('current', { packages: ['corechart', 'line'] });
    window.google && window.google.charts.setOnLoadCallback(() => console.log('Google charts API loaded'));
  }).catch(console.warn);

export const graphError = error => dispatch => dispatch({ type: types.ERROR, error });

export const clearGraphData = () => dispatch => dispatch({ type: types.DELETE });
