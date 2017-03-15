// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';

import app from './app';
import user from './user';
import notifications from './notifications';
import columns from './columns';
import results from './results';
import sets from './sets';
import sources from './sources';
import alerts from './alerts';
import reports from './reports';

// Compose reducers
// ===========================================================================
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create actual store
// ===========================================================================
export default createStore(
  combineReducers({
    app,
    user,
    notifications,
    results,
    columns,
    sets,
    sources,
    alerts,
    reports,
    routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
);