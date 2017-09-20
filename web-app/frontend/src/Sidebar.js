import React, {Component} from 'react'
import PlaceIcon from 'material-ui/svg-icons/maps/place'
import FlatButton from 'material-ui/FlatButton'

import AreaSelector from './AreaSelector'

class Sidebar extends Component {

  render() {
    const {style} = this.props
    const sidebarStyle = {
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      background: '#FAFAFA',
      zIndex: 2,
      padding: '30px 25px',
    }

    return (
      <div style={{...sidebarStyle, ...style}}>
        <SidebarHeadline icon={PlaceIcon} text="Service Area" />
        <SidebarContent>
          <CSVUploader />
          <InputSeparator />
          <AreaSelector />
        </SidebarContent>
      </div>
    )
  }
}


class SidebarHeadline extends Component {

  render() {
    const {icon, text} = this.props
    const IconTag = icon
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <IconTag style={{color: 'rgba(0, 0, 0, 0.54)'}} />
        <div style={{color: 'rgba(0, 0, 0, 0.87)', marginLeft: 23, textTransform: 'uppercase'}}>
          {text}
        </div>
      </div>
    )
  }
}


class SidebarContent extends Component {

  render() {
    return (
      <div style={{paddingLeft: 46, paddingTop: 20, display: 'flex', flexDirection: 'column'}}>
        {this.props.children}
      </div>
    )
  }
}


class CSVUploader extends Component {

  render() {
    return (
      <div>
        <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.54)', lineHeight: '20px', marginBottom: 15}}>
          Choose a CSV file containing a list of valid Zip Codes and/or Counties.
        </div>
        <FlatButton style={{color: "#F2F2F2"}} backgroundColor="#3F51B5" label="upload CSV" />
      </div>
    )
  }
}


class InputSeparator extends Component {

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', margin: '20px 0'}}>
        <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
        <div style={{textAlign: 'center', flex: 1, color: 'rgba(0, 0, 0, 0.541327)', fontSize: 14, margin: '0 auto'}}>OR</div>
        <div style={{height: 0, borderTop: '1px solid rgba(0, 0, 0, 0.54)', width: '40%'}} />
      </div>
    )
  }
}


export default Sidebar
