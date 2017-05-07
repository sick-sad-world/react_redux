import React from 'react';
import { Route } from 'react-router';
import Container from './container';

export default (
  <Route path='/columns' component={Container} label='Columns' icon='archive'>
    <Route path=':id' component={Container}>
      <Route path=':assignment' component={Container} />
    </Route>
  </Route>
);
