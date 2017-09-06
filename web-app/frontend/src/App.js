import React, { Component } from 'react';
import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Button from './components/ui/Button.js';
import NavBar from './components/ui/NavBar.js';
import PurpleButton from './components/ui/PurpleButton.js';
import RequestButton from './components/ui/RequestButton.js';
import SplitPane from './components/ui/SplitPane.js';
import TableView from './components/ui/TableView.js';
import CsvUploadDialog from './components/ui/CsvUploadDialog.js';

import './App.css';
class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <NavBar />
        <SplitPane
          left={
            <CsvUploadDialog/>
          }
          right={
            <TableView/>
          } />
        <Button />
        <PurpleButton name="Button"/>
        <RequestButton />
      </div>
      </MuiThemeProvider>
    )
  }
}

export default App;
