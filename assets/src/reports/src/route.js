import React from 'react';
import { Route } from 'react-router';
import Container from './page';

export default (
  <Route path='/reports' component={Container} label='Reports' icon='news'>
    <Route path=':id' component={Container} />
  </Route>
);
