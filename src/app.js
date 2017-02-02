// Import babel polyfill to get all ES6 sugar right here
// ===========================================================================
import 'babel-polyfill';

// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './reducers/app';
import user from './reducers/user';
import notifications from './reducers/notifications';
import columns from './reducers/columns';
import sets from './reducers/sets';
import sources from './reducers/sources';
import alerts from './reducers/alerts';
import reports from './reducers/reports';

// Import all required actions
// ===========================================================================
import { setAppState, getUser, fetchData, errorHandler } from './actions/actions';

// Import all stuff related to React
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// React routing and connection to store
// ===========================================================================
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// Import two main screens fo an App
// ===========================================================================
// import Workspace from './containers/workspace';
// import Auth from './containers/auth';
// import App from './containers/app'

// Import components wich represents each of App sections
// ===========================================================================
import App from './containers/app';
import Auth from './containers/auth';
import Workspace from './containers/workspace';

// Compose reducers
// ===========================================================================
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create actual store
// ===========================================================================
let TrendolizerStore = createStore(
  combineReducers({
    app,
    user,
    notifications,
    columns,
    sets,
    sources,
    alerts,
    reports,
    routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
);

// Sync App history with store
// ===========================================================================
let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

// Render an actual App
// ===========================================================================
render(
  <Provider store={TrendolizerStore}>
    <Router history={history}>
      <Route components={App}>
        <Route path='/auth' component={Auth} />
        <Route path='/' component={Workspace}>
        </Route>
      </Route>
      <Redirect from='*' to='/' />
    </Router>
  </Provider>,
  document.getElementById('appRoot')
);

// Ask server about initial data
// ===========================================================================
TrendolizerStore
  .dispatch(getUser(null, {state: false, notification: false}))
  .then(() => TrendolizerStore.dispatch(fetchData()))
  .catch((err) => TrendolizerStore.dispatch(errorHandler(err)))
  .then(() => TrendolizerStore.dispatch(setAppState(2)));