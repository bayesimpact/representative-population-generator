import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

import styles from './styles'

class ZipCodeSelector extends Component {


  handleChange = (countyZipKey, isInputChecked) => {
    const {onSelectCountyZip, onRemoveCountyZip} = this.props
    if (isInputChecked) {
      onSelectCountyZip(countyZipKey)
    } else {
      onRemoveCountyZip(countyZipKey)
    }
  }

  render() {
    const {
      onSelectAllChange, counties, selectedCounties, selectedCountyZips,
      style, isSelectAllChecked,
    } = this.props
    if (!counties) {
      return null
    }
    return (
      <div style={style}>
        {selectedCounties.length ? <Checkbox
            checked={isSelectAllChecked}
            label="Select All"
            onCheck={(e, isInputChecked) => onSelectAllChange(isInputChecked)} /> :
          null}
        {(selectedCounties || []).sort().map(countyKey => {
          const county = counties[countyKey]
          return <List key={countyKey}>
            <Subheader style={{marginBottom: '-16px'}}>
              {countyKey}
            </Subheader>
            {county.zips.sort().map(zip => {
              const countyZipKey = countyKey + '-' + zip
              const checkbox = <Checkbox
                  checked={selectedCountyZips.includes(countyZipKey)}
                  onCheck={(e, isInputChecked) => this.handleChange(countyZipKey, isInputChecked)} />
              return <ListItem
                  innerDivStyle={{height: 10, padding: '16px 16px 6px 72px'}}
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


export const ZipCodeSelectorHeadline = ({selectedCountyZips}) => (
  <div style={{display: 'flex', flex: 'none', marginTop: 5}}>
    <div style={{marginBottom: 15, color: styles.primaryText}}>
      Zip Codes
    </div>
    <div style={{flex: 1}} />
    <div style={{color: styles.secondaryText}}>
      {selectedCountyZips.length} selected
    </div>
  </div>
)

export default ZipCodeSelector
