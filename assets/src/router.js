import React from 'react';
import { Route, Redirect } from 'react-router';

// Import Containers
// ===========================================================================
import { App, Auth } from './application';
import { Route as Dashboard } from './dashboards';
import { Route as Columns } from './columns';
import { Route as Sets } from './sets';
import { Route as Alerts } from './alerts';
import { Route as Reports } from './reports';
import { Route as User, Workspace } from './user';

export default (
  <Route components={App}>
    <Route path='/auth' component={Auth} />
    <Route path='/' component={Workspace}>
      {Dashboard}
      {Columns}
      {Sets}
      {Alerts}
      {Reports}
      {User}
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);
