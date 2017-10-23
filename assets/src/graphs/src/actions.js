import createAction from 'common/action-factory';
import types from './types';
import { fetchScript } from 'src/communication';

export const getResultMeasurements = createAction({
  action: types.READ,
  call: 'graphdata'
});

export const getBriefMeasurements = createAction({
  action: types.UPDATE_CACHE,
  call: 'graphdata'
});

export const fetchGoogleGraphs = () => fetchScript('https://www.gstatic.com/charts/loader.js')
  .then(() => {
    window.google && window.google.charts.load('current', { packages: ['corechart', 'line'] });
    window.google && window.google.charts.setOnLoadCallback(() => console.log('Google charts API loaded'));
  }).catch(console.warn);

export const clearGraphData = () => dispatch => dispatch({ type: types.DELETE });
