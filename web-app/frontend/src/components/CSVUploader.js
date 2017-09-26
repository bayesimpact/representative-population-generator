import React, {Component} from 'react'

import RaisedButton from 'material-ui/RaisedButton'

import styles from '../styles'


class CSVUploader extends Component {

  handleFileSelect = e => {
    const {onFileSelected} = this.props
    onFileSelected && onFileSelected(e.target.files[0])
  }

  render() {
    const {selectedCSVFileName} = this.props
    const commentStyle = {
      fontSize: 14,
      color: styles.secondaryText,
      lineHeight: '20px',
      marginBottom: 15,
    }
    const fileNameStyle = {
      maxWidth: 150,
      color: styles.secondaryText,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }
    return (
      <div>
        <div style={commentStyle}>
          Choose a CSV file containing a list of valid Zip Codes and/or Counties.
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <RaisedButton
              containerElement="label"
              primary={true}
              label="upload CSV">
            <input
              onChange={this.handleFileSelect}
              type="file"
              accept=".csv"
              style={{display: 'none'}} />
          </RaisedButton>
          <div style={{flex: 1}} />
          <div style={fileNameStyle}>
            {selectedCSVFileName}
          </div>
        </div>
      </div>
    )
  }
}

export default CSVUploader
