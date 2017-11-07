import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Dashboard from './containers/dashboard';
import { path } from './defaults';

export default (
  <Route omit path={path}>
    <Route omit path={':name(/:col)'} component={Dashboard}></Route>
    <IndexRedirect omit to={`${path}/dashboard`}/>
  </Route>
);
