import React, { Component } from 'react';
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux';
import thunk from 'redux-thunk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './App.css';
import {mainReducer} from './reducers'
import AreaSelector from './AreaSelector'
import TableView from './TableView'
import MapView from './MapView'
import Header from './Header'

// Redux DevTools extension, install from here: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(mainReducer, composeEnhancers(
  applyMiddleware(thunk)
))

class App extends Component {

  render() {
    return (
      <div>
        <Header />
        <AreaSelector />
        {/* <TableView /> */}
        <MapView />
      </div>
    );
  }
}

class AppContainer extends Component {

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <App />
        </MuiThemeProvider>
      </Provider>
    )
  }
}


export default AppContainer;
