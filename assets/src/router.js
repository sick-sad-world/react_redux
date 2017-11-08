import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

// Import Containers
// ===========================================================================
import { Route as Auth, App } from './application';
import { Route as Dashboard, path } from './dashboards';
import { Route as Columns } from './columns';
import { Route as Sets } from './sets';
import { Route as Alerts } from './alerts';
import { Route as Reports } from './reports';
import { Route as User, Workspace } from './user';

export default (
  <Route components={App}>
    {Auth}
    <Route path='/' component={Workspace}>
      {Columns}
      {Sets}
      {Alerts}
      {Reports}
      {User}
      {Dashboard}
      <IndexRedirect omit to={path}/>
      <Redirect omit from='*' to={path}/>
    </Route>
  </Route>
);
