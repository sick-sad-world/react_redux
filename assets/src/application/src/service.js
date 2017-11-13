import createService from 'common/service-pool';
import defaultApp, { getAction } from './defaults';

// Create action types and context
// ===========================================================================
const { types, addAction, createReducer } = createService('application', 'error', 'state', 'init');

// Create Reducer
// ===========================================================================
export default createReducer({
  [getAction('user.logout')]: () => ({ ...defaultApp, state: 2 }),
  [types.error]: (state, payload) => ({ ...state, error: payload, state: 0 }),
  [types.state]: (state, payload) => ({ ...state, state: payload }),
  [types.init]: (state, payload) => ({ ...state, state: payload })
}, defaultApp);

// Client error action
// ===========================================================================
export const clientError = addAction(types.error, error => (error instanceof Error) ? error.stack : error);

// Change app state
// ===========================================================================
export const setAppState = addAction(types.state, state => state);

// Initial loading sequence
// ===========================================================================
export const initLoading = addAction(types.state, async (params, opts, { dispatch }) => {
  // Get user - check if user is authenticated
  // ===========================================================================
  const { id } = await getAction('user.read');

  if (id) {
    // Get columns
    // ===========================================================================
    const columns = await dispatch(getAction('columns.read')());

    // Get results
    // ===========================================================================
    await dispatch(getAction('results.readAll')(columns));

    // Get all other data
    // ===========================================================================
    await Promise.all([
      dispatch(getAction('sets.read')()),
      dispatch(getAction('feeds.read')()),
      dispatch(getAction('alerts.read')()),
      dispatch(getAction('reports.read')())
    ]);
  }

  // Return state to change on success
  // ===========================================================================
  return 2;
});

