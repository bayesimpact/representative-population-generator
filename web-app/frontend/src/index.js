import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './AppContainer';
import registerServiceWorker from './registerServiceWorker';

const rootEl = document.getElementById('root')

ReactDOM.render(
  <AppContainer />,
  rootEl
)

if (module.hot) {
  module.hot.accept('./AppContainer', () => {
    const NextApp = require('./AppContainer').default
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}
registerServiceWorker();
