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

    let points = [{
                    "geometry": {
                        "coordinates": [
                            -122.42320641999999,
                            37.777893832000075
                        ],
                        "type": "Point"
                    },
                    "properties": {
                        "county": "sanFrancisco",
                        "residents": 1334,
                        "zip": "94102"
                    },
                    "type": "Feature"
                },
                {
                    "geometry": {
                        "coordinates": [
                            -0,
                            49
                        ],
                        "type": "Point"
                    },
                    "properties": {
                        "county": "sanFran",
                        "residents": 666,
                        "zip": "90210"
                    },
                    "type": "Feature"
                }

]
    return (
      <MuiThemeProvider>
      <div className="App">
        <NavBar />
        <SplitPane
          left={
            <CsvUploadDialog/>
          }
          right={
            <TableView points={points}/>
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
