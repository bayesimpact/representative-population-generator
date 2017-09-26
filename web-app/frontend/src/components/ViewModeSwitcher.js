import React, {Component} from 'react'
import FlatButton from 'material-ui/FlatButton'

class ViewModeSwitcher extends Component {

  render() {
    const {style, onViewModeClick, viewMode} = this.props
    const switcherStyle = {
      background: 'rgba(238, 238, 238, 0.9)',
      zIndex: 1,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    return (
      <div style={{...switcherStyle, ...style}}>
        <ViewModeButton
            label="Table"
            isSelected={viewMode === 'table'}
            onClick={() => onViewModeClick('table')} />
        <ViewModeButton
            label="Map"
            isSelected={viewMode === 'map'}
            onClick={() => onViewModeClick('map')} />
      </div>
    )
  }
}

class ViewModeButton extends Component {

  render() {
    const {label, onClick, isSelected} = this.props
    const underlineStyle = {
      height: 0,
      borderTop: isSelected ? '3px solid #3F51B5' : 'none',
    }
    return (
      <div>
        <FlatButton label={label} onClick={onClick} />
        <div style={underlineStyle} />
      </div>
    )
  }
}

export default ViewModeSwitcher
