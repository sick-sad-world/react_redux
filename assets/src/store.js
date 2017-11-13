// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunk from 'redux-thunk';
import { sortMiddleware } from 'common/reducer-factory';
import { freezePool, setGlobalError, getAction } from 'common/service-pool';

// Import module store data
// ===========================================================================
import { reducer as dashboards, ensureDashboardUrl } from 'src/dashboards';
import { reducer as columns, processColumn } from 'src/columns';
import { reducer as results, splitResultText, numerizeTabularData } from 'src/results';
import { reducer as notifications } from 'src/notifications';
import { reducer as app } from 'src/application';
import { reducer as user, fixMissingEmailBcc } from 'src/user';
import { reducer as graphs, mapGraphData } from 'src/graphs';
import { reducer as sets, clearFeeds } from 'src/sets';
import { reducer as feeds } from 'src/feeds';
import { reducer as alerts, processAlert } from 'src/alerts';
import { reducer as reports, processReport } from 'src/reports';

// Compose reducers
// ===========================================================================
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

setGlobalError('application.error');
freezePool();

// Create actual store
// ===========================================================================
export default createStore(
  combineReducers({
    app,
    user,
    notifications,
    dashboards,
    graphs,
    columns,
    results,
    sets,
    feeds,
    alerts,
    reports,
    routing
  }),
  composeEnhancers(applyMiddleware(
    thunk,
    sortMiddleware,
    processColumn,
    processAlert,
    processReport,
    fixMissingEmailBcc(state => (state.reports), 'recipient', getAction('report.edit')),
    fixMissingEmailBcc(state => (state.alerts), 'recipient', getAction('alert.edit')),
    ensureDashboardUrl,
    clearFeeds,
    numerizeTabularData,
    splitResultText,
    mapGraphData
  ))
);
