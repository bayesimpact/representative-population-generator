import React, {Component} from 'react'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';


class AreaSelector extends Component {

  render() {
    const {
      counties, isLoading, selectedCounties, selectedCountyZips,
      onCountyChange, onCountyZipChange
    } = this.props
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div>
        <StateSelector />
        <CountySelector
            selectedCounties={selectedCounties}
            counties={counties}
            onChange={onCountyChange} />
        <ZipCodeSelector
            selectedCounties={selectedCounties}
            selectedCountyZips={selectedCountyZips}
            counties={counties}
            onChange={onCountyZipChange} />
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

export default AreaSelector
