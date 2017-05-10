// Import global app state types
// ===========================================================================
import { ERROR, STATE } from 'common/type-factory';

// Import all required fetch methods from other modules (optional)
// ===========================================================================
import { getColumns } from 'src/columns';
import { getSets } from 'src/sets';
import { getFeeds } from 'src/feeds';
import { getAlerts } from 'src/alerts';
import { getReports } from 'src/reports';
import { getDashboards } from 'src/dashboards';

// Set global app JS error
// ===========================================================================
export function clientError(error) {
  return dispatch => dispatch({
    type: ERROR,
    error: (error instanceof Error) ? error.stack : error
  });
}

// Set global app state
// ===========================================================================
export function setAppState(state) {
  return dispatch => dispatch({
    type: STATE,
    state
  });
}

// Fetch all data (on INIT or on LOGIN)
// ===========================================================================
export function fetchData(opts) {
  const options = {
    ...opts,
    state: false,
    notification: false
  };

  return dispatch => Promise.all([
    (getDashboards instanceof Function) ? dispatch(getDashboards(null, options)) : null,
    (getColumns instanceof Function) ? dispatch(getColumns({ data: 1 }, options)) : null,
    (getSets instanceof Function) ? dispatch(getSets(null, options)) : null,
    (getFeeds instanceof Function) ? dispatch(getFeeds(null, options)) : null,
    (getAlerts instanceof Function) ? dispatch(getAlerts(null, options)) : null,
    (getReports instanceof Function) ? dispatch(getReports(null, options)) : null
  ]);
}
