import React, { Component } from 'react';
import {createStore, applyMiddleware, compose} from 'redux'
import {connect, Provider} from 'react-redux';
import thunk from 'redux-thunk'
import './App.css';
import {fetchCounties} from './actions'
import {mainReducer} from './reducers'

// Redux DevTools extension, install from here: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(mainReducer, composeEnhancers(
  applyMiddleware(thunk)
))

class App extends Component {

  constructor(props) {
    super(props)
    props.dispatch(fetchCounties())
  }

  render() {
    return (
      <div>
        <h1>Network Adequacy</h1>
      </div>
    );
  }
}
const ConnectedApp = connect()(App)

class AppContainer extends Component {

  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    )
  }
}


export default AppContainer;
