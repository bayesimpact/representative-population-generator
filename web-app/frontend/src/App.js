import React, { Component } from 'react';
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './App.css';
import {mainReducer} from './reducers'
import Sidebar from './Sidebar'
import TableView from './TableView'
import MapView from './MapView'
import Header from './Header'
import ViewModeSwitcher from './ViewModeSwitcher'
import {setViewMode} from './actions'

// Redux DevTools extension, install from here: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(mainReducer, composeEnhancers(
  applyMiddleware(thunk)
))

class App extends Component {

  handleViewModeChange = viewMode => {
    this.props.dispatch(setViewMode(viewMode))
  }

  render() {
    const {viewMode} = this.props
    const fullContainerStyle = {
      height: '100%',
      width: '100%',
    }
    const switcherStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
    }
    return (
      <div style={{height: '100%'}}>
        <Header />
        <div style={{display: 'flex', height: '100%'}}>
          <Sidebar style={{height: '100%', width: 330}} />
          <div style={{position: 'relative', ...fullContainerStyle}}>
            <ViewModeSwitcher
                style={switcherStyle}
                viewMode={viewMode}
                onViewModeClick={this.handleViewModeChange} />
            {viewMode === 'map' ?
              <MapView style={fullContainerStyle} /> :
              <TableView style={{paddingTop: 80, height: '100%'}} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  viewMode: state.app.viewMode,
})

const ConnectedApp = connect(mapStateToProps)(App)

class AppContainer extends Component {

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <ConnectedApp />
        </MuiThemeProvider>
      </Provider>
    )
  }
}


export default AppContainer;
