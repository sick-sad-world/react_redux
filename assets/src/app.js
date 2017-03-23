// Import babel polyfill to get all ES6 sugar right here
// ===========================================================================
import 'babel-polyfill';

// Import all stuff related to React
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// React routing and connection to store
// ===========================================================================
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import TrendolizerStore from './redux';

// Import components wich represents each of App sections
// ===========================================================================
import App from './screens/app';
import Auth from './screens/auth';
import Workspace from './screens/workspace';
import Columns from './containers/columns';
import Sourcesets from './containers/sets';
import Alerts from './containers/alerts';
import Reports from './containers/reports';
import User from './containers/user';


// Render an actual App
// ===========================================================================
render(
  <Provider store={TrendolizerStore}>
    <Router history={syncHistoryWithStore(browserHistory, TrendolizerStore)}>
      <Route components={App}>
        <Route path='/auth' component={Auth} />
        <Route path='/' component={Workspace}>
          <Route path='/columns' component={Columns} label='Columns' icon='archive'>
            <Route path=':id' component={Columns}>
              <Route path=':assignment' component={Sourcesets} />
            </Route>
          </Route>
          <Route path='/sets' component={Sourcesets} label='Sourcesets' icon='globe'>
            <Route path=':id' component={Sourcesets}>
              <Route path=':create' component={Sourcesets} />
            </Route>
          </Route>
          <Route path='/alerts' component={Alerts} label='Alerts' icon='paper-plane'>
            <Route path=':id' component={Alerts} />
          </Route>
          <Route path='/reports' component={Reports} label='Reports' icon='news'>
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