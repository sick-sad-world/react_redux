import React from 'react';
import { Route } from 'react-router';
import Dashboard from './containers/dashboard';
import { path } from './defaults';

export default (
  <Route omit path={'/:name(/:column)'} component={Dashboard}></Route>
);
