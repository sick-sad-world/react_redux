import 'style-loader!css-loader!react-virtualized/styles.css';
import 'scss/app.scss';

// Import packages
// ===========================================================================
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
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
function renderApp(scheme) {
  render(
    <AppContainer>
      <Provider store={TrendolizerStore}>
        <Router key={Math.random()} routes={scheme} history={syncHistoryWithStore(browserHistory, TrendolizerStore)} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

renderApp(Scheme);
if (module.hot) module.hot.accept('./router', () => render(Scheme));
