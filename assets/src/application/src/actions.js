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
import { actions as userActions } from 'src/user';
import { getAllResults } from 'src/results';
import { getColumnsForResults } from 'src/columns';

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
    dispatch(getDashboards(null, opts)),
    dispatch(getColumns({ data: 1 }, opts)),
    dispatch(getSets(null, opts)),
    dispatch(getFeeds(null, opts)),
    dispatch(getAlerts(null, opts)),
    dispatch(getReports(null, opts))
  ]);
}

export function initialLoading(opts) {
  const options = { silent: true, ...opts };

  return (dispatch) => {
    if (!window.google && fetchGoogleGraphs) fetchGoogleGraphs();
    return dispatch(userActions.getUser(null, options))
      .then(() => dispatch(fetchData(options)))
      .then(getColumnsForResults)
      .then(data => dispatch(getAllResults(data)))
      .catch(err => (err instanceof Error) ? dispatch(clientError(err)) : console.log(err))
      .then(() => dispatch(setAppState(2)));
  };
}
