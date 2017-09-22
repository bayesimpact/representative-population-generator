import React, {Component} from 'react'
import _ from 'underscore'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

import LoadingOverlay from './LoadingOverlay'
import styles from './styles'

class AreaSelector extends Component {

  render() {
    const {
      counties, isLoading, selectedCounties, selectedCountyZips,
      onCountyChange, onCountyZipChange
    } = this.props
    return (
      <div style={{position: 'relative'}}>
        {isLoading ? <LoadingOverlay /> : null}
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
        {Object.keys(counties || {}).sort().map(countyKey => (
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

  state = {
    isSelectAllChecked: false,
  }

  componentWillReceiveProps = nextProps => {
    const {selectedCounties, onChange} = this.props
    if (nextProps && nextProps.selectedCounties !== selectedCounties) {
      if (this.state.isSelectAllChecked) {
        const allZips = this.getAllZipsForCounties(nextProps.selectedCounties)
        onChange && onChange(allZips)
      }
    }
  }

  handleChange = (countyZipKey, isInputChecked) => {
    const {onChange, selectedCountyZips} = this.props
    const newSelectedCountyZips = isInputChecked ?
      selectedCountyZips.concat([countyZipKey]) :
      _.without(selectedCountyZips, countyZipKey)
    onChange && onChange(newSelectedCountyZips)
  }

  handleSelectAllChange = isInputChecked => {
    const {onChange, selectedCounties} = this.props
    this.setState({isSelectAllChecked: isInputChecked})
    let newSelectedCountyZips = []
    if (isInputChecked) {
      newSelectedCountyZips = this.getAllZipsForCounties(selectedCounties)
    }
    onChange && onChange(newSelectedCountyZips)
  }

  getAllZipsForCounties = selectedCounties => {
    const {counties} = this.props
    return selectedCounties.reduce((accu, selectedCounty) => {
      const countyZips = counties[selectedCounty].zips.map(zip => {
        return selectedCounty + '-' + zip
      })
      return accu.concat(countyZips)
    }, [])
  }

  render() {
    const {counties, selectedCounties, selectedCountyZips, style} = this.props
    const {isSelectAllChecked} = this.state
    if (!counties) {
      return null
    }
    return (
      <div style={style}>
        <ZipCodeSelectorHeadline selectedCountyZips={selectedCountyZips} />
        {selectedCounties.length ? <Checkbox
            checked={isSelectAllChecked}
            label="Select All"
            onCheck={(e, isInputChecked) => this.handleSelectAllChange(isInputChecked)} /> :
          null}
        {(selectedCounties || []).sort().map(countyKey => {
          const county = counties[countyKey]
          return <List key={countyKey}>
            <Subheader>{county.displayName}</Subheader>
            {county.zips.sort().map(zip => {
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


const ZipCodeSelectorHeadline = ({selectedCountyZips}) => (
  <div style={{display: 'flex'}}>
    <div style={{marginBottom: 15, color: styles.primaryText}}>
      Zip Codes
    </div>
    <div style={{flex: 1}} />
    <div style={{color: styles.secondaryText}}>
      {selectedCountyZips.length} selected
    </div>
  </div>
)


export default AreaSelector
