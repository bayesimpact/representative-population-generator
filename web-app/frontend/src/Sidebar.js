import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'underscore'

import PlaceIcon from 'material-ui/svg-icons/maps/place'
import PointsIcon from 'material-ui/svg-icons/image/grain'
import FlatButton from 'material-ui/FlatButton'

import AreaSelector from './AreaSelector'
import PointNumberSelector from './PointNumberSelector'
import {
  fetchCounties,
  fetchAreas,
  setSelectedCounties,
  setSelectedCountyZips,
  setPointNumber,
} from './actions'


class Sidebar extends Component {

  constructor(props) {
    super(props)
    props.dispatch(fetchCounties())
    // TODO: Remove, this is only for debugging.
    props.dispatch(fetchAreas(props.selectedCountyZips))
  }

  handleCountyChange = selectedCounties => {
    this.props.dispatch(setSelectedCounties(selectedCounties))
  }

  handleCountyZipChange = selectedCountyZips => {
    const {dispatch} = this.props
    dispatch(setSelectedCountyZips(selectedCountyZips))
    dispatch(fetchAreas(selectedCountyZips))
  }

  handlePointNumberChange = _.throttle(nPoints => {
    this.props.dispatch(setPointNumber(nPoints))
  }, 300)

  render() {
    const {counties, isLoading, selectedCounties, selectedCountyZips, nPoints, style} = this.props
    const sidebarStyle = {
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      background: '#FAFAFA',
      zIndex: 2,
      padding: '30px 25px',
    }

    return (
      <div style={{...sidebarStyle, ...style}}>
        <SidebarHeadline icon={PlaceIcon} text="Service Area" />
        <SidebarContent>
          <CSVUploader />
          <InputSeparator />
          <AreaSelector
              counties={counties}
              isLoading={isLoading}
              selectedCounties={selectedCounties}
              selectedCountyZips={selectedCountyZips}
              onCountyChange={this.handleCountyChange}
              onCountyZipChange={this.handleCountyZipChange} />
        </SidebarContent>
        <SidebarHeadline icon={PointsIcon} text="Enrolees" />
        <SidebarContent>
          <PointNumberSelector
              value={nPoints}
              onChange={this.handlePointNumberChange} />
        </SidebarContent>
      </div>
    )
  }
}


class SidebarHeadline extends Component {

  render() {
    const {icon, text} = this.props
    const IconTag = icon
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <IconTag style={{color: 'rgba(0, 0, 0, 0.54)'}} />
        <div style={{color: 'rgba(0, 0, 0, 0.87)', marginLeft: 23, textTransform: 'uppercase'}}>
          {text}
        </div>
      </div>
    )
  }
}


class SidebarContent extends Component {

  render() {
    return (
      <div style={{marginBottom: 15, paddingLeft: 46, paddingTop: 20, display: 'flex', flexDirection: 'column'}}>
        {this.props.children}
      </div>
    )
  }
}


class CSVUploader extends Component {

  render() {
    return (
      <div>
        <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.54)', lineHeight: '20px', marginBottom: 15}}>
          Choose a CSV file containing a list of valid Zip Codes and/or Counties.
        </div>
        <FlatButton style={{color: "#F2F2F2"}} backgroundColor="#3F51B5" label="upload CSV" />
      </div>
    )
  }
}


class InputSeparator extends Component {

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', margin: '20px 0'}}>
        <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
        <div style={{textAlign: 'center', flex: 1, color: 'rgba(0, 0, 0, 0.541327)', fontSize: 14, margin: '0 auto'}}>OR</div>
        <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
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
})

export default connect(mapStateToProps)(Sidebar)
