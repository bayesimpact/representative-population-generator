import React, {Component} from 'react'
import {connect} from 'react-redux'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class AreaSelector extends Component {

  state = {
    selectedCounties: [],
  }

  handleCountyChange = (event, index, values) => {
    this.setState({selectedCounties: values})
  }

  render() {
    const {counties, isLoading} = this.props
    const {selectedCounties} = this.state
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div>
        <CountySelector
            selectedCounties={selectedCounties}
            counties={counties}
            onChange={this.handleCountyChange} />
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

const mapStateToProps = state => ({
  isLoading: state.isLoading.counties || state.isLoading.points,
  counties: state.data.counties,
})

export default connect(mapStateToProps)(AreaSelector)
