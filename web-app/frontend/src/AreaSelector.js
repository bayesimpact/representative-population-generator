import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

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
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div style={style}>
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
    const {counties, selectedCounties, selectedCountyZips} = this.props
    return (
      <div>
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
