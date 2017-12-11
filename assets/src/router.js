import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';

// Import Containers
// ===========================================================================
import { Auth, Login, Register, App } from './application';
import { Dashboard } from './dashboards';
import { ColumnsPage } from './columns';
import { SetsPage } from './sets';
import { CreateFeed } from './feeds';
import { AlertsPage } from './alerts';
import { ReportsPage } from './reports';
import { UserSettings, Workspace } from './user';

const AUTH = '/auth';
const DASH = '/d';

export default (
  <Route components={App}>

    <Route path={AUTH} component={Auth}>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
      <IndexRedirect to='/login'/>
    </Route>

    <Route path='/' authPath={AUTH} dashboardPath={DASH} component={Workspace}>

      <Route path='/columns' component={ColumnsPage} label='Columns' icon='archive'>
        <Route path=':id' component={ColumnsPage}>
          <Route path=':assignment' component={ColumnsPage} />
        </Route>
      </Route>

      <Route path='/sets' component={SetsPage} label='Sourcesets' icon='globe'>
        <Route path=':id' component={SetsPage}>
          <Route path=':create' component={CreateFeed} />
        </Route>
      </Route>

      <Route path='/alerts' component={AlertsPage} label='Alerts' icon='paper-plane'>
        <Route path=':id' component={AlertsPage} />
      </Route>

      <Route path='/reports' component={ReportsPage} label='Reports' icon='news'>
        <Route path=':id' component={ReportsPage} />
      </Route>

      <Route path='/settings' component={UserSettings} label='Settings' icon='cog' />

      <Route omit path={DASH}>
        <Route omit path=':name(/:col)' component={Dashboard}></Route>
        <IndexRedirect omit to={`${DASH}/dashboard`}/>
      </Route>

      <IndexRedirect omit to={DASH}/>
      <Redirect omit from='*' to={DASH}/>

    </Route>
  </Route>
);
