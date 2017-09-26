import React, { Component } from 'react';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar'

import './App.css';
import Sidebar from './Sidebar'
import TableView from './TableView'
import MapView from './MapView'
import Header from './Header'
import ViewModeSwitcher from './ViewModeSwitcher'
import MissingAreasDialog from './MissingAreasDialog'
import {setViewMode, resetMissingAreas, resetSnackMessage} from './actions'


class App extends Component {

  handleViewModeChange = viewMode => {
    this.props.dispatch(setViewMode(viewMode))
  }

  handleMissingAreasCloseClick = () => {
    this.props.dispatch(resetMissingAreas())
  }

  handleSnackbarRequestClose = () => {
    this.props.dispatch(resetSnackMessage())
  }

  render() {
    const {viewMode, missingAreas, snackMessage} = this.props
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
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <MissingAreasDialog
            isOpen={!!missingAreas.length}
            missingAreas={missingAreas}
            onCloseClick={this.handleMissingAreasCloseClick} />
        <Snackbar
            open={!!snackMessage}
            message={snackMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarRequestClose} />
        <Header />
        <div style={{display: 'flex', flex: 1, position: 'relative'}}>
          <Sidebar style={{height: '100%', display: 'flex', flexDirection: 'column'}} />
          <div style={{position: 'relative', ...fullContainerStyle}}>
            <ViewModeSwitcher
                style={switcherStyle}
                viewMode={viewMode}
                onViewModeClick={this.handleViewModeChange} />
            {viewMode === 'map' ?
              <MapView style={fullContainerStyle} /> :
              <TableView style={{paddingTop: 80, height: 'calc(100% - 80px)'}} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  viewMode: state.app.viewMode,
  missingAreas: state.app.missingAreas,
  snackMessage: state.app.snackMessage,
})

export default connect(mapStateToProps)(App)