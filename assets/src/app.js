import style from 'scss/app.scss';

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
import { actions as appActions } from 'src/application';

// Import App route Scheme
// ===========================================================================
import Scheme from './router';

window.onerror = (...args) => TrendolizerStore.dispatch(appActions.clientError(args[args.length]));

// Render an actual App
// ===========================================================================
function renderApp() {
  render(
    <AppContainer>
      <Provider store={TrendolizerStore}>
        <Router key={Math.random()} routes={Scheme} history={syncHistoryWithStore(browserHistory, TrendolizerStore)} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

renderApp();
if (module.hot) module.hot.accept('./router', () => renderApp());
