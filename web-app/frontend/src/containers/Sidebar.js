import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'underscore'

import PlaceIcon from 'material-ui/svg-icons/maps/place'
import PointsIcon from 'material-ui/svg-icons/image/grain'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'

import StateSelector from '../components/StateSelector'
import CountySelector from '../components/CountySelector'
import ZipCodeSelector, {ZipCodeSelectorHeadline} from '../components/ZipCodeSelector'
import PointNumberSelector from '../components/PointNumberSelector'
import LoadingOverlay from '../components/LoadingOverlay'
import CSVUploader from '../components/CSVUploader'
import {
  fetchCounties,
  fetchAreasFromCSVFile,
  selectCountyAction,
  removeCountyAction,
  selectCountyZipAndFetchAreas,
  removeCountyZipAndFetchAreas,
  setSelectAllCheckedAndFetchAreas,
  setSelectAllUnchecked,
  setPointNumber,
  resetAreaSelector,
} from '../actions'
import styles from '../styles'
import types from '../types'


class Sidebar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    counties: PropTypes.objectOf(types.countyShape),
    isLoading: PropTypes.bool.isRequired,
    selectedCounties: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCountyZips: PropTypes.arrayOf(PropTypes.string).isRequired,
    nPoints: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    selectedCSVFileName: PropTypes.string.isRequired,
    isSelectAllChecked: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props)
    props.dispatch(fetchCounties())
  }

  handleSelectCounty = county => {
    this.props.dispatch(selectCountyAction(county))
  };

  handleRemoveCounty = county => {
    this.props.dispatch(removeCountyAction(county))
  };

  handleSelectCountyZip = countyZip => {
    this.props.dispatch(selectCountyZipAndFetchAreas(countyZip))
  };

  handleRemoveCountyZip = countyZip => {
    this.props.dispatch(removeCountyZipAndFetchAreas(countyZip))
  };

  handleSelectAllChange = isInputChecked => {
    const {dispatch} = this.props
    if (isInputChecked) {
      dispatch(setSelectAllCheckedAndFetchAreas())
    } else {
      dispatch(setSelectAllUnchecked())
    }
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
      nPoints, style, selectedCSVFileName, isSelectAllChecked,
    } = this.props
    const sidebarStyle = {
      zIndex: 2,
      padding: '30px 25px',
    }
    const areaSelectorStyle = {
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }
    return (
      <Paper style={{...sidebarStyle, ...style}}>
        <SidebarHeadline icon={PlaceIcon} text="Service Area" />
        <SidebarContent>
          <CSVUploader
              selectedCSVFileName={selectedCSVFileName}
              onFileSelected={this.handleCSVFileSelected} />
          <InputSeparator />
          <div style={areaSelectorStyle}>
            {isLoading ? <LoadingOverlay /> : null}
            <StateSelector />
            <CountySelector
                selectedCounties={selectedCounties}
                counties={counties}
                onSelectCounty={this.handleSelectCounty}
                onRemoveCounty={this.handleRemoveCounty} />
            <ZipCodeSelectorHeadline
                nSelectedCountyZips={selectedCountyZips.length} />
            <ZipCodeSelector
                style={{flex: 1, overflow: 'auto'}}
                counties={counties}
                selectedCounties={selectedCounties}
                isSelectAllChecked={isSelectAllChecked}
                selectedCountyZips={selectedCountyZips}
                onSelectAllChange={this.handleSelectAllChange}
                onSelectCountyZip={this.handleSelectCountyZip}
                onRemoveCountyZip={this.handleRemoveCountyZip} />
          </div>
        </SidebarContent>
        <SidebarHeadline icon={PointsIcon} text="Enrollees" />
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

  static propTypes = {
    icon: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

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

  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
  };

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
  isSelectAllChecked: state.app.isSelectAllChecked,
})

export default connect(mapStateToProps)(Sidebar)