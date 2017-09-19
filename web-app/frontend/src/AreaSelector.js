import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

import {fetchCounties, fetchAreas} from './actions'

class AreaSelector extends Component {

  constructor(props) {
    super(props)
    props.dispatch(fetchCounties())
  }

  state = {
    selectedCounties: [],
    selectedCountyZips: [],
  }

  handleCountyChange = (event, index, values) => {
    this.setState({selectedCounties: values})
  }

  handleCountyZipChange = selectedCountyZips => {
    this.setState({selectedCountyZips})
    const countyZips = selectedCountyZips.map(countyZip => {
      const [county, zip] = countyZip.split('-')
      return {county, zip}
    })
    this.props.dispatch(fetchAreas(countyZips))
  }

  render() {
    const {counties, isLoading} = this.props
    const {selectedCounties, selectedCountyZips} = this.state
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div>
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
          onChange={onChange}>
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
})

export default connect(mapStateToProps)(AreaSelector)
