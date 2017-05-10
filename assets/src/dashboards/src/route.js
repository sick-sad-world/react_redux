import React from 'react';
import { Route } from 'react-router';
import Container from './containers/container';
import { path } from './defaults';

export default (
  <Route omit path={'/:name'} component={Container}></Route>
);
