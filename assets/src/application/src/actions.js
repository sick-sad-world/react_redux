// Import global app state types
// ===========================================================================
import types from './types';

// Import all required fetch methods from other modules (optional)
// ===========================================================================
import { getColumns } from 'src/columns';
import { getSets } from 'src/sets';
import { getFeeds } from 'src/feeds';
import { getAlerts } from 'src/alerts';
import { getReports } from 'src/reports';
import { getDashboards } from 'src/dashboards';
import { fetchGoogleGraphs } from 'src/graphs';
import { getUser } from 'src/user';
import { getAllResults } from 'src/results';
import { getColumnsForResults } from 'src/columns';

function initErrorHandler(err) {
  if (err instanceof Error) throw err;
  else console.log('Not logged in');
}

// Set global app JS error
// ===========================================================================
export function clientError(error) {
  return dispatch => dispatch({
    type: types.ERROR,
    error: (error instanceof Error) ? error.stack : error
  });
}

// Set global app state
// ===========================================================================
export function setAppState(state) {
  return dispatch => dispatch({
    type: types.STATE,
    state
  });
}

// Fetch all data (on INIT or on LOGIN)
// ===========================================================================
export function fetchData(opts) {
  return dispatch => Promise.all([
    (getDashboards instanceof Function) ? dispatch(getDashboards(null, opts)) : null,
    (getColumns instanceof Function) ? dispatch(getColumns({ data: 1 }, opts)) : null,
    (getSets instanceof Function) ? dispatch(getSets(null, opts)) : null,
    (getFeeds instanceof Function) ? dispatch(getFeeds(null, opts)) : null,
    (getAlerts instanceof Function) ? dispatch(getAlerts(null, opts)) : null,
    (getReports instanceof Function) ? dispatch(getReports(null, opts)) : null
  ]);
}

export function initialLoading(init, opts) {
  const options = { ...opts, state: false, notification: false };

  return (dispatch) => {
    if (!window.google) fetchGoogleGraphs();
    return dispatch(getUser(null, options))
      .then(() => dispatch(fetchData(options)))
      .then(getColumnsForResults)
      .then(data => dispatch(getAllResults(data)))
      .catch((init) ? initErrorHandler : null)
      .then(() => dispatch(setAppState(2)));
  };
}
