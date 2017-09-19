import React, {Component} from 'react'
import {connect} from 'react-redux'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class AreaSelector extends Component {

  state = {
    selectedCounties: [],
  }

  handleChange = (event, index, values) => {
    this.setState({selectedCounties: values})
  }

  menuItems(values) {
    const {counties} = this.props
    const {selectedCounties} = this.state
    return Object.keys(counties || {}).map(countyKey => (
      <MenuItem
        key={countyKey}
        insetChildren={true}
        checked={selectedCounties && selectedCounties.includes(countyKey)}
        value={countyKey}
        primaryText={counties[countyKey].displayName}
      />
    ));
  }

  render() {
    const {counties} = this.props
    const {selectedCounties} = this.state
    return (
      <div>
        <SelectField
          multiple={true}
          hintText="Select counties"
          value={selectedCounties}
          onChange={this.handleChange}>
          {this.menuItems(selectedCounties)}
        </SelectField>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.isLoading.counties || state.isLoading.points,
  counties: state.data.counties,
})

export default connect(mapStateToProps)(AreaSelector)
