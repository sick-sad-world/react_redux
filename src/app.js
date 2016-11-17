import "babel-polyfill";

// Data part imports
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import logger from "./middlewares/logger";
import messager from "./middlewares/messager";
import processIds from "./middlewares/processIds";

import * as reducers from "./reducers";

import getUser from "./actions/user";
import { getAppData } from "./actions/auth";

// View part imports
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import App from "./containers/app";
import Auth from "./containers/auth";
import Dashboard from "./components/dashboard";
import * as Alerts from "./containers/alerts";
import * as Reports from "./containers/reports";
import * as Columns from "./containers/columns";
import * as Sourcesets from "./containers/sourcesets";
import Profile from "./components/profile";

let initialState = {
  user: {},
  alerts: [],
  reports: [],
  columns: [],
  sources: [],
  sourcesets: []
};

let TrendolizerStore = createStore(
  combineReducers({ ...reducers, routing: routerReducer }),
  initialState,
  applyMiddleware(thunk, logger, messager)
);

let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

TrendolizerStore.dispatch(getUser())
  .then(() => TrendolizerStore.dispatch(getAppData()))
  .then(() => render(
    <Provider store={TrendolizerStore}>
      <Router history={history}>
        <Route path="/auth" component={Auth}/>
        <Route path="/" component={App}>
          <IndexRoute components={{main: Dashboard}} />
          <Route path="/alerts" components={Alerts}/>
          <Route path="/reports" components={Reports}/>
          <Route path="/columns" components={Columns}/>
          <Route path="/sourcesets" components={Sourcesets}/>
          <Route path="/settings" components={{main: Profile}}/>
        </Route>
      </Router>
    </Provider>,
    document.getElementById("appRoot")
  ));
