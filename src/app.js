import 'babel-polyfill';

// Data part imports
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import logger from './middlewares/logger';
import messager from './middlewares/messager';
import processIds from './middlewares/processIds';

import alerts from './reducers/alerts';
import reports from './reducers/reports';
import columns from './reducers/columns';
import user from './reducers/user';

import getUser from './actions/user';
import getAlerts from './actions/alerts';
import getReports from './actions/reports';
import getColumns from './actions/columns';

// View part imports
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

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

let TrendolizerStore = window.TrendolizerStore = createStore(
  combineReducers({ alerts, reports, columns, user }),
  initialState,
  applyMiddleware(thunk, logger, messager, processIds)
);

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
})

render(
  <Provider store={TrendolizerStore}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('appRoot')
)
