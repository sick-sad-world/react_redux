import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Auth from './containers/auth';
import Login from './containers/login';
import Register from './containers/register';

export default (
  <Route path='/auth' component={Auth}>
    <Route path='/login' component={Login}/>
    <Route path='/register' component={Register}/>
    <IndexRedirect to='/login'/>
  </Route>
);
