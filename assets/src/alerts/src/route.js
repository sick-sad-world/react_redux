import React from 'react';
import { Route } from 'react-router';
import Container from './page';

export default (
  <Route path='/alerts' component={Container} label='Alerts' icon='paper-plane'>
    <Route path=':id' component={Container} />
  </Route>
);
