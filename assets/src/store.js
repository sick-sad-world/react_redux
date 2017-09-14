// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { routerReducer as routing } from 'react-router-redux';
import thunk from 'redux-thunk';
import { sortMiddleware } from 'common/reducer-factory';

// Import module store data
// ===========================================================================
import { reducer as dashboards, ensureDashboardUrl } from 'src/dashboards';
import { reducer as columns, processColumn } from 'src/columns';
import { reducer as results, splitResultText, numerizeTabularData } from 'src/results';
import { reducer as notifications, notification } from 'src/notifications';
import { reducer as app, clientError } from 'src/application';
import { reducer as user, fixMissingEmailBcc } from 'src/user';
import { reducer as graphs, mapGraphData } from 'src/graphs';
import { reducer as sets, updateUniq, clearFeeds } from 'src/sets';
import { reducer as feeds } from 'src/feeds';
import { reducer as alerts, processAlert, editAlert } from 'src/alerts';
import { reducer as reports, processReport, editReport } from 'src/reports';

// Compose reducers
// ===========================================================================
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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
    thunk.withExtraArgument({ notification, clientError }),
    // createEpicMiddleware(),
    sortMiddleware,
    processColumn,
    processAlert,
    processReport,
    fixMissingEmailBcc(state => (state.reports.payload), 'recipient', editReport),
    fixMissingEmailBcc(state => (state.alerts.payload), 'recipient', editAlert),
    ensureDashboardUrl,
    updateUniq,
    clearFeeds,
    numerizeTabularData,
    splitResultText,
    mapGraphData
  ))
);
