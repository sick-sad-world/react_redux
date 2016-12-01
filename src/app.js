// Import babel polyfill to get all ES6 sugar right here
// ===========================================================================
import 'babel-polyfill';

// Imports related to State tree
// ===========================================================================
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import messager from './middlewares/messager';
import * as reducers from './reducers';

// Import all required actions
// ===========================================================================
import { throwError, setAppState, readData, fetchData } from './actions/actions';

// Import all stuff related to React
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// React routing and connection to store
// ===========================================================================
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// Import two main screens fo an App
// ===========================================================================
import Workspace from './containers/workspace';
import Auth from './containers/auth';
import App from './containers/app'

// Import components wich represents each of App sections
// ===========================================================================
import Dashboard from './components/dashboard';
import * as Alerts from './components/alerts';
import * as Reports from './components/reports';
import * as Columns from './components/columns';
import * as Sourcesets from './components/sourcesets';
import Profile from './components/user/profile';

// Set App itinial state
// ===========================================================================
let initialState = {
  app: {
    appState: 0, // 0 -init, 1 -fetching, 2 -ready, 3 -loading, 4 -error 
    userState: false
  },
  user: {},
  alerts: [],
  reports: [],
  columns: [],
  sources: [],
  sets: []
};

// Compose reducers
// ===========================================================================
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create actual store
// ===========================================================================
let TrendolizerStore = createStore(
  combineReducers({ ...reducers, routing: routerReducer }),
  initialState,
  composeEnhancers(applyMiddleware(thunk, messager))
);

// Sync App history with store
// ===========================================================================
let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

// Render an actual App
// ===========================================================================
render(
  <Provider store={TrendolizerStore}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='/auth' component={Auth} />
        <Route component={Workspace}>
          <Route path='/dashboard(/:id)' components={{main: Dashboard}} />
          <Route path='/alerts(/:id)(/:assigment)' components={Alerts}/>
          <Route path='/reports(/:id)(/:assigment)' components={Reports}/>
          <Route path='/columns(/:id)(/:assigment)' components={Columns}/>
          <Route path='/sourcesets(/:id)(/:create)' components={Sourcesets}/>
          <Route path='/settings' components={{main: Profile}}/>
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('appRoot')
);

// Ask server about initial data
// ===========================================================================
TrendolizerStore.dispatch(setAppState(1));
TrendolizerStore.dispatch(readData('user')(true))
  .then((action) => action.payload.id && TrendolizerStore.dispatch(fetchData(true)))
  .catch((error) => TrendolizerStore.dispatch(throwError(error)))
  .then(() => TrendolizerStore.dispatch(setAppState(2)));