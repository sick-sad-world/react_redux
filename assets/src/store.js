// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunk from 'redux-thunk';

// Import module store data
// ===========================================================================
import { reduser as columns, processColumn } from 'src/columns';
import { reduser as results, splitResultText } from 'src/results';
import { reduser as notifications, notification } from 'src/notifications';
import { reduser as app, clientError } from 'src/application';
import { reduser as user } from 'src/user';
import { reduser as sets, updateUniq, clearFeeds } from 'src/sets';
import { reduser as feeds } from 'src/feeds';
import { reduser as alerts } from 'src/alerts';
import { reduser as reports } from 'src/reports';

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
