import 'babel-polyfill';

// Data part imports
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import messager from './middlewares/messager';
import * as reducers from './reducers';

import { throwError, setAppState, readData, fetchData } from './actions/actions';

// View part imports
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import Workspace from './containers/workspace';
import Auth from './containers/auth';

import Dashboard from './components/dashboard';
import * as Alerts from './components/alerts';
import * as Reports from './components/reports';
import * as Columns from './components/columns';
import * as Sourcesets from './components/sourcesets';
import Profile from './components/profile';

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

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let TrendolizerStore = createStore(
  combineReducers({ ...reducers, routing: routerReducer }),
  initialState,
  composeEnhancers(applyMiddleware(thunk, messager))
);
let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

render(
  <Provider store={TrendolizerStore}>
    <Router history={history}>
      <Route path='/auth' component={Auth} />
      <Route path='/' component={Workspace}>
        <IndexRoute components={{main: Dashboard}} />
        <Route path='/alerts(/:id)(/:assigment)' components={Alerts}/>
        <Route path='/reports(/:id)(/:assigment)' components={Reports}/>
        <Route path='/columns(/:id)(/:assigment)' components={Columns}/>
        <Route path='/sourcesets(/:id)(/:create)' components={Sourcesets}/>
        <Route path='/settings' components={{main: Profile}}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('appRoot')
);

TrendolizerStore.dispatch(setAppState(1));
TrendolizerStore.dispatch(readData('user')(true))
  .then((action) => action.payload.id && TrendolizerStore.dispatch(fetchData(true)))
  .catch((error) => TrendolizerStore.dispatch(throwError(error)))
  .then(() => TrendolizerStore.dispatch(setAppState(2)));