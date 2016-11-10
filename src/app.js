import 'babel-polyfill';

// Data part imports
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import logger from './middlewares/logger';
import messager from './middlewares/messager';
import processIds from './middlewares/processIds';

import reducers from './reducers';

import getUser from './actions/user';
import getAlerts from './actions/alerts';
import getReports from './actions/reports';
import getColumns from './actions/columns';

// View part imports
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import App from './components/app.js';

let initialState = {
  user: {
    id: null,
    hash: '',
    email: '',
    email_bcc: [],
    name: '',
    fullname: 'Name Surname',
    position: 'user position',
    status: null,
    is_admin: '0',
    image: 'img/ph_user.png'
  },
  alerts: {},
  reports: {},
  columns: {}
};

let TrendolizerStore = createStore(
  combineReducers({ ...reducers, routing: routerReducer }),
  initialState,
  applyMiddleware(thunk, logger, messager, processIds)
);

let history = syncHistoryWithStore(browserHistory, store);

// Fetch data -> May be rewritten
TrendolizerStore.dispatch(getUser()).then(() => {
  if (TrendolizerStore.getState().user.id) {
    Promise.all([
      TrendolizerStore.dispatch(getAlerts()),
      TrendolizerStore.dispatch(getReports()),
      TrendolizerStore.dispatch(getColumns())
    ]).then(() => {
      console.log('Done');
    });
  } else {

  }
});

render(
  <Provider store={TrendolizerStore}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('appRoot')
)
