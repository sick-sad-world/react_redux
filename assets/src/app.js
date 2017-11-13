// import 'style-loader!css-loader!react-virtualized/styles.css';
import 'babel-polyfill';

// Import packages
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Import store
// ===========================================================================
import TrendolizerStore from './store';

// Import App route Scheme
// ===========================================================================
import Scheme from './router';

// Render an actual App
// ===========================================================================
render(
  <Provider store={TrendolizerStore}>
    <Router routes={Scheme} history={syncHistoryWithStore(browserHistory, TrendolizerStore)} />
  </Provider>,
  document.getElementById('root')
);
