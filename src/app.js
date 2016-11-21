import "babel-polyfill";

// Data part imports
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import logger from "./middlewares/logger";
import messager from "./middlewares/messager";

import * as reducers from "./reducers";

import { getAppData, setAppState } from "./actions/app";
import getUser from "./actions/user";

// View part imports
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import Workspace from "./containers/workspace";
import Auth from "./containers/auth";
import Dashboard from "./components/dashboard";
import * as Alerts from "./components/alerts";
import * as Reports from "./components/reports";
import * as Columns from "./components/columns";
import * as Sourcesets from "./components/sourcesets";
import Profile from "./components/profile";

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
  sourcesets: []
};

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let TrendolizerStore = createStore(
  combineReducers({ ...reducers, routing: routerReducer }),
  initialState,
  composeEnhancers(applyMiddleware(thunk, messager))
);

let history = syncHistoryWithStore(browserHistory, TrendolizerStore);

let renderApp = () => {
  render(
    <Provider store={TrendolizerStore}>
      <Router history={history}>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={Workspace}>
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
  );
}
renderApp();
TrendolizerStore.dispatch(setAppState(1));
TrendolizerStore.dispatch(getUser(true)).then(function (action) {
  if (action && action.payload.id) {
    TrendolizerStore.dispatch(getAppData(true)).then(() => {
      TrendolizerStore.dispatch(setAppState(2));
    });
  } else {
    TrendolizerStore.dispatch(setAppState(2));
  }
});