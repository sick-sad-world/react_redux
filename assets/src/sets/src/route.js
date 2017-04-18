import React from 'react';
import { Route } from 'react-router';
import Container from './container';

export default (
  <Route path='/sets' component={Container} label='Sourcesets' icon='globe'>
    <Route path=':id' component={Container}>
      <Route path=':create' component={Container} />
    </Route>
  </Route>
);
