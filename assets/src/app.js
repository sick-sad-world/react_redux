import 'babel-polyfill';
import { Component } from 'react';
import { render } from 'react-dom';

import 'normalize.css';
import '../sass/app.scss';

render(
  (
    <div>Here will be app 123s
    </div>
  ),
  document.getElementById('root')
);
