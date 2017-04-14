// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';

// Import module middlewares
// ===========================================================================
import sendRequest from 'common/send-request';
import { splitResultText } from 'src/results/middlewares';
import { sendMessage } from 'src/notifications/middlewares';
import { updateUniq, clearFeeds } from 'src/sets/middlewares';
import { processColumn } from 'src/columns/middlewares';

// Import module store data
// ===========================================================================
import columns from 'src/columns/reduser';
import results from 'src/results/reduser';
import notifications from 'src/notifications/reduser';
import app from 'src/application/reduser';
import user from 'src/user/reduser';
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
  combineReducers({ app, user, notifications, columns, results, sets, feeds, alerts, reports, routing: routerReducer }),
  composeEnhancers(applyMiddleware(sendMessage('before'), sendRequest, sendMessage('after'), processColumn, updateUniq, clearFeeds, splitResultText))
);
