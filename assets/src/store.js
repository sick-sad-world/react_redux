// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunk from 'redux-thunk';

// Import application actions
// ===========================================================================
import { notification } from 'src/notifications/actions';
import { actions as appActions } from 'src/application';

// Import module middlewares
// ===========================================================================
// import sendRequest from 'common/send-request';
import { splitResultText } from 'src/results/middlewares';
// import { sendMessage } from 'src/notifications/middlewares';
import { updateUniq, clearFeeds } from 'src/sets/middlewares';
import { processColumn } from 'src/columns/middlewares';

// Import module store data
// ===========================================================================
import columns from 'src/columns/reduser';
import results from 'src/results/reduser';
import notifications from 'src/notifications/reduser';
import { reduser as app } from 'src/application/reduser';
import { reduser as user } from 'src/user';
import sets from 'src/sets/reduser';
import feeds from 'src/feeds/reduser';
import alerts from 'src/alerts/reduser';
import reports from 'src/reports/reduser';

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
    thunk.withExtraArgument({ notification, clientError: appActions.clientError }),
    processColumn,
    updateUniq,
    clearFeeds,
    splitResultText)
  )
);
