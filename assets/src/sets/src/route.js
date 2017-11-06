import React from 'react';
import { Route } from 'react-router';
import Container from './containers/page';
import CreateFeed from 'src/feeds';

export default (
  <Route path='/sets' component={Container} label='Sourcesets' icon='globe'>
    <Route path=':id' component={Container}>
      {CreateFeed && <Route path=':create' component={CreateFeed} />}
    </Route>
  </Route>
);
