import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'underscore'

import PlaceIcon from 'material-ui/svg-icons/maps/place'
import PointsIcon from 'material-ui/svg-icons/image/grain'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

import AreaSelector from './AreaSelector'
import PointNumberSelector from './PointNumberSelector'
import {
  fetchCounties,
  fetchAreas,
  fetchAreasFromCSVFile,
  selectCountyAction,
  removeCountyAction,
  setSelectedCountyZips,
  setPointNumber,
  resetAreaSelector,
} from './actions'
import styles from './styles'


class Sidebar extends Component {

  constructor(props) {
    super(props)
    props.dispatch(fetchCounties())
    // TODO: Remove, this is only for debugging.
    props.dispatch(fetchAreas(props.selectedCountyZips))
  }

  handleSelectCounty = county => {
    this.props.dispatch(selectCountyAction(county))
  }

  handleRemoveCounty = county => {
    this.props.dispatch(removeCountyAction(county))
  }

  handleCountyZipChange = selectedCountyZips => {
    const {dispatch} = this.props
    dispatch(setSelectedCountyZips(selectedCountyZips))
    dispatch(fetchAreas(selectedCountyZips))
  };

  handlePointNumberChange = _.throttle(nPoints => {
    this.props.dispatch(setPointNumber(nPoints))
  }, 300);

  handleCSVFileSelected = file => {
    const {dispatch} = this.props
    dispatch(resetAreaSelector())
    dispatch(fetchAreasFromCSVFile(file))
  };

  handleClearInputsClick = () => {
    this.props.dispatch(resetAreaSelector())
  }

  render() {
    const {
      counties, isLoading, selectedCounties, selectedCountyZips,
      nPoints, style, selectedCSVFileName,
    } = this.props
    const sidebarStyle = {
      zIndex: 2,
      padding: '30px 25px',
    }

    return (
      <Paper style={{...sidebarStyle, ...style}}>
        <SidebarHeadline icon={PlaceIcon} text="Service Area" />
        <SidebarContent>
          <CSVUploader
              selectedCSVFileName={selectedCSVFileName}
              onFileSelected={this.handleCSVFileSelected} />
          <InputSeparator />
          <AreaSelector
              counties={counties}
              isLoading={isLoading}
              selectedCounties={selectedCounties}
              selectedCountyZips={selectedCountyZips}
              onSelectCounty={this.handleSelectCounty}
              onRemoveCounty={this.handleRemoveCounty}
              onCountyZipChange={this.handleCountyZipChange} />
        </SidebarContent>
        <SidebarHeadline icon={PointsIcon} text="Enrolees" />
        <SidebarContent style={{flex: 'none'}}>
          <PointNumberSelector
              value={nPoints}
              onChange={this.handlePointNumberChange} />
        </SidebarContent>
        <FlatButton
          style={{alignSelf: 'flex-start', flex: 'none'}}
          onClick={this.handleClearInputsClick}
          primary={true}
          label="clear inputs" />
      </Paper>
    )
  }
}


class SidebarHeadline extends Component {

  render() {
    const {icon, text} = this.props
    const IconTag = icon
    const style = {
      display: 'flex',
      alignItems: 'center',
    }
    const iconStyle = {
      color: styles.secondaryText
    }
    const textStyle = {
      color: styles.primaryText,
      marginLeft: 23,
      textTransform: 'uppercase'
    }
    return (
      <div style={style}>
        <IconTag style={iconStyle} />
        <div style={textStyle}>
          {text}
        </div>
      </div>
    )
  }
}


class SidebarContent extends Component {

  render() {
    const {style} = this.props
    const contentStyle = {
      marginBottom: 15,
      paddingLeft: 46,
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
    }
    return (
      <div style={{...contentStyle, ...style}}>
        {this.props.children}
      </div>
    )
  }
}


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


class InputSeparator extends Component {

  render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
    }
    const lineStyle = {
      height: 0,
      borderTop: `1px solid ${styles.secondaryText}`,
      width: '40%',
    }
    const textStyle = {
      textAlign: 'center',
      flex: 1,
      color: styles.secondaryText,
      fontSize: 14,
      margin: '0 auto',
    }
    return (
      <div style={style}>
        <div style={lineStyle} />
        <div style={textStyle}>OR</div>
        <div style={lineStyle} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.isLoading.counties || state.isLoading.areas,
  counties: state.data.counties,
  selectedCounties: state.app.selectedCounties,
  selectedCountyZips: state.app.selectedCountyZips,
  nPoints: state.app.nPoints,
  selectedCSVFileName: state.app.selectedCSVFileName,
})

export default connect(mapStateToProps)(Sidebar)
