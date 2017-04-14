import React from 'react';
import { Route, Redirect } from 'react-router';

// Import Containers
// ===========================================================================
import { App, Auth } from './application/containers';
import Columns from './columns/containers';
import Sourcesets from './sets/containers';
import Alerts from './alerts/containers';
import Reports from './reports/containers';
import { User, Workspace } from './user/containers';

export default (
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
      <Route path='/settings' component={User} label='Settings' icon='cog' />
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);
