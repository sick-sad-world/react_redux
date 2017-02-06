// Import babel polyfill to get all ES6 sugar right here
// ===========================================================================
import 'babel-polyfill';

// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './redux/app';
import user from './redux/user';
import notifications from './redux/notifications';
import columns from './redux/columns';
import sets from './redux/sets';
import sources from './redux/sources';
import alerts from './redux/alerts';
import reports from './redux/reports';

// Import all required actions
// ===========================================================================
import { getUser } from './redux/user';
import { setAppState, fetchData, errorHandler } from './redux/app';

// Import all stuff related to React
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// React routing and connection to store
// ===========================================================================
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// Import components wich represents each of App sections
// ===========================================================================
import App from './containers/app';
import Auth from './containers/auth';
import Workspace from './containers/workspace';
import Columns from './containers/columns';
import Sourcesets from './containers/sets';
import Alerts from './containers/alerts';
import Reports from './containers/reports';
import User from './containers/user';

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
          <Route path='/columns' component={Columns} label='Columns list' icon='archive'>
            <Route path=':id' component={Columns} />
          </Route>
          <Route path='/sets' component={Sourcesets} label='Sourcesets list' icon='globe'>
            <Route path=':id' component={Sourcesets} />
          </Route>
          <Route path='/alerts' component={Alerts} label='Alerts list' icon='paper-plane'>
            <Route path=':id' component={Alerts} />
          </Route>
          <Route path='/reports' component={Reports} label='Reports list' icon='news'>
            <Route path=':id' component={Reports} />
          </Route>
          <Route path='/settings' component={User} label='Settings' icon='cog'/>
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