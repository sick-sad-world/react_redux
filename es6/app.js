import 'babel-polyfill';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from './middlewares/logger';
import messager from './middlewares/messager';
import { defaultAlert, alerts } from './reducers/alerts';
import reports from './reducers/reports';
import { defaultUser, user } from './reducers/user';

// Just for testing -> remove it later
import * as authActions from './actions/auth';
import * as userActions from './actions/user';
import * as alertActions from './actions/alerts';

let initialState = {
  user: defaultUser,
  alerts: {},
  reports: {}
};

let TrendolizerStore = window.TrendolizerStore = createStore(
  combineReducers({ alerts, reports, user }),
  initialState,
  applyMiddleware(thunk, logger, messager)
);

TrendolizerStore.dispatch(userActions.getUser()).then(() => {
  if (TrendolizerStore.getState().user.id) {
    Promise.all([
      TrendolizerStore.dispatch(alertActions.getAlerts())
    ]).then(() => {
      console.log('Done');
    });
  } else {

  }
})


// Just for testing -> remove it later
window.TrendolizerActions = {
  authActions,
  userActions,
  alertActions
};