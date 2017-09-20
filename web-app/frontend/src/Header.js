import React, {Component} from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import GithubIcon from 'mui-icons/fontawesome/github'

class Header extends Component {

  state = {
    isAboutDialogOpen: false,
  }

  render() {
    const {isAboutDialogOpen} = this.state
    const style = {
      padding: '16px 20px',
      backgroundColor: '#607D8B',
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    }
    const headingStyle = {
      fontSize: 20,
    }
    return (
      <div style={style}>
        <AboutDialog
            isOpen={isAboutDialogOpen}
            onCloseClick={() => this.setState({isAboutDialogOpen: false})} />
        <div style={headingStyle}>Network Adequacy</div>
        <div style={{flex: 1}} />
        <FlatButton
            label="About"
            onClick={() => this.setState({isAboutDialogOpen: true})}
            style={{color: '#fff'}} />
        <FlatButton
            href="https://github.com/bayesimpact/network-adequacy"
            target="_blank"
            style={{color: '#fff'}}
            icon={<GithubIcon />} />
      </div>
    )
  }
}


class AboutDialog extends Component {

  render() {
    const {isOpen, onCloseClick} = this.props
    const actions = [
      <FlatButton label="Close" primary={true} onClick={onCloseClick} />,
    ];
    return (
      <Dialog open={isOpen} onRequestClose={onCloseClick} actions={actions}>
        <h2>Oh yeah!</h2>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </Dialog>
    );
  }
}


export default Header
