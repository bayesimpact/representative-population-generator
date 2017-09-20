import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import PlaceIcon from 'material-ui/svg-icons/maps/place'
import FlatButton from 'material-ui/FlatButton'

import {fetchCounties, fetchAreas, setSelectedCounties, setSelectedCountyZips} from './actions'

class AreaSelector extends Component {

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

  render() {
    const {counties, isLoading, selectedCounties, selectedCountyZips, style} = this.props
    const areaSelectorStyle = {
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      background: '#FAFAFA',
      zIndex: 2,
      padding: '30px 25px',
    }
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div style={{...areaSelectorStyle, ...style}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <PlaceIcon style={{color: 'rgba(0, 0, 0, 0.54)'}} />
          <div style={{color: 'rgba(0, 0, 0, 0.87)', marginLeft: 23, textTransform: 'uppercase'}}>Service Area</div>
        </div>
        <div style={{paddingLeft: 46, paddingTop: 20, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.54)', lineHeight: '20px', marginBottom: 15}}>
            Choose a CSV file containing a list of valid Zip Codes and/or Counties.
          </div>
          <FlatButton style={{color: "#F2F2F2"}} backgroundColor="#3F51B5" label="upload CSV" />
          <div style={{display: 'flex', alignItems: 'center', margin: '20px 0'}}>
            <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
            <div style={{textAlign: 'center', flex: 1, color: 'rgba(0, 0, 0, 0.541327)', fontSize: 14, margin: '0 auto'}}>OR</div>
            <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
          </div>
          <StateSelector />
          <CountySelector
              selectedCounties={selectedCounties}
              counties={counties}
              onChange={this.handleCountyChange} />
          <ZipCodeSelector
              selectedCounties={selectedCounties}
              selectedCountyZips={selectedCountyZips}
              counties={counties}
              onChange={this.handleCountyZipChange} />
        </div>
      </div>
    )
  }
}


class StateSelector extends Component {

  render() {
    return (
      <SelectField value='california'>
        <MenuItem value={'california'} primaryText="California" />
      </SelectField>
    )
  }
}


class CountySelector extends Component {

  render() {
    const {counties, selectedCounties, onChange} = this.props
    return (
      <SelectField
          multiple={true}
          hintText="Select counties"
          value={selectedCounties}
          onChange={(event, index, values) => onChange(values)}>
        {Object.keys(counties || {}).map(countyKey => (
          <MenuItem
              key={countyKey}
              insetChildren={true}
              checked={selectedCounties && selectedCounties.includes(countyKey)}
              value={countyKey}
              primaryText={counties[countyKey].displayName} />
        ))}
      </SelectField>
    )
  }
}


class ZipCodeSelector extends Component {

  handleChange = (countyZipKey, isInputChecked) => {
    const {onChange, selectedCountyZips} = this.props
    const newSelectedCountyZips = isInputChecked ?
      selectedCountyZips.concat([countyZipKey]) :
      _.without(selectedCountyZips, countyZipKey)
    onChange && onChange(newSelectedCountyZips)
  }

  render() {
    const {counties, selectedCounties, selectedCountyZips, style} = this.props
    return (
      <div style={style}>
        {(selectedCounties || []).map(countyKey => {
          const county = counties[countyKey]
          return <List key={countyKey}>
            <Subheader>{county.displayName}</Subheader>
            {county.zips.map(zip => {
              const countyZipKey = countyKey + '-' + zip
              const checkbox = <Checkbox
                  checked={selectedCountyZips.includes(countyZipKey)}
                  onCheck={(e, isInputChecked) => this.handleChange(countyZipKey, isInputChecked)} />
              return <ListItem
                  key={countyZipKey}
                  primaryText={zip}
                  leftCheckbox={checkbox} />
            })}
          </List>
        })}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.isLoading.counties || state.isLoading.areas,
  counties: state.data.counties,
  selectedCounties: state.app.selectedCounties,
  selectedCountyZips: state.app.selectedCountyZips,
})

export default connect(mapStateToProps)(AreaSelector)
