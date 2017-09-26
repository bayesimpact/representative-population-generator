import React, {Component} from 'react'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class CountySelector extends Component {

  handleChange = (event, index, values) => {
    const {selectedCounties, onSelectCounty, onRemoveCounty} = this.props
    const removedValues = _.difference(selectedCounties, values)
    removedValues.forEach(value => onRemoveCounty(value))
    const selectedValues = _.difference(values, selectedCounties)
    selectedValues.forEach(value => onSelectCounty(value))
  }

  render() {
    const {counties, selectedCounties} = this.props
    return (
      <SelectField
          multiple={true}
          hintText="Select counties"
          value={selectedCounties}
          onChange={this.handleChange}>
        {Object.keys(counties || {}).sort().map(countyKey => (
          <MenuItem
              key={countyKey}
              insetChildren={true}
              checked={selectedCounties && selectedCounties.includes(countyKey)}
              value={countyKey}
              primaryText={countyKey} />
        ))}
      </SelectField>
    )
  }
}

export default CountySelector
