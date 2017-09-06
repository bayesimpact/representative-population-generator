import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';

const style = {
  margin: 12,
};

export default class CsvDownloadButton extends React.Component {

  render(){
    return (
        <div>
            <RaisedButton label="Download" style={style} />
        </div>
    );
  }



}
