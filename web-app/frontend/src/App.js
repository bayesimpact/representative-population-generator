import React, { Component } from 'react';
import {createStore} from 'redux'
import {connect, Provider} from 'react-redux';
import './App.css';
import {fetchCounties} from './actions'
import {mainReducer} from './reducers'

const store = createStore(mainReducer)

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
