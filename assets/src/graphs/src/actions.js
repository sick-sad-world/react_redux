import createAction from 'common/action-factory';
import types from './types';
import { fetchScript } from 'src/communication';

export const getResultMeasurements = createAction({
  action: types.READ,
  loading: types.STATE,
  call: 'graphdata'
});

export const getBriefMeasurements = createAction({
  action: types.UPDATE_CACHE,
  loading: types.STATE,
  call: 'graphdata'
});

export const fetchGoogleGraphs = () => fetchScript('https://www.gstatic.com/charts/loader.js')
  .then(() => {
    window.google && window.google.charts.load('current', { packages: ['corechart', 'line'] });
    window.google && window.google.charts.setOnLoadCallback(() => console.log('Google charts API loaded'));
  }).catch(console.warn);

export const graphError = error => dispatch => dispatch({ type: types.ERROR, error });

export const clearGraphData = () => dispatch => dispatch({ type: types.DELETE });
