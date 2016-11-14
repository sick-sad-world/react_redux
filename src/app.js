import "babel-polyfill";

// Data part imports
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import logger from "./middlewares/logger";
import messager from "./middlewares/messager";
import processIds from "./middlewares/processIds";

import * as reducers from "./reducers";

import getUser from "./actions/user";
import getAlerts from "./actions/alerts";
import getReports from "./actions/reports";
import getColumns from "./actions/columns";

// View part imports
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import App from "./containers/app";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";

let initialState = {
  user: {
    id: null,
    hash: "",
    email: "",
    email_bcc: [],
    name: "",
    fullname: "Name Surname",
    position: "user position",
    status: null,
    is_admin: "0",
    image: "img/ph_user.png"
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

let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

// Fetch data -> May be rewritten
TrendolizerStore.dispatch(getUser()).then(() => {
  if (TrendolizerStore.getState().user.id) {
    Promise.all([
      TrendolizerStore.dispatch(getAlerts()),
      TrendolizerStore.dispatch(getReports()),
      TrendolizerStore.dispatch(getColumns())
    ]).then(() => {
      // Render whole app
      render(
        <Provider store={TrendolizerStore}>
          <Router history={history}>
            <Route path="/auth" component={Auth}/>
            <Route path="/" component={App}>
              <IndexRoute component={Dashboard} />
              <Route path="/settings" component={Profile}/>
            </Route>
          </Router>
        </Provider>,
        document.getElementById("appRoot")
      )
    });
  } else {

  }
});