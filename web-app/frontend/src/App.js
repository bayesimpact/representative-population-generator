import React, { Component } from 'react';
import {connect} from 'react-redux';

import './App.css';
import Sidebar from './Sidebar'
import TableView from './TableView'
import MapView from './MapView'
import Header from './Header'
import ViewModeSwitcher from './ViewModeSwitcher'
import {setViewMode} from './actions'


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

export default connect(mapStateToProps)(App)
