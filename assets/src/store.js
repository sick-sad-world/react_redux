// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunk from 'redux-thunk';

// Import module store data
// ===========================================================================
import { reducer as dashboards } from 'src/dashboards';
import { reducer as columns, processColumn } from 'src/columns';
import { reducer as results, splitResultText } from 'src/results';
import { reducer as notifications, notification } from 'src/notifications';
import { reducer as app, clientError } from 'src/application';
import { reducer as user } from 'src/user';
import { reducer as sets, updateUniq, clearFeeds } from 'src/sets';
import { reducer as feeds } from 'src/feeds';
import { reducer as alerts } from 'src/alerts';
import { reducer as reports } from 'src/reports';

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
    processColumn,
    updateUniq,
    clearFeeds,
    splitResultText
  ))
);
