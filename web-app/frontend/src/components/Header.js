import React, {Component} from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import {indigo500} from 'material-ui/styles/colors'
import GithubIcon from 'mui-icons/fontawesome/github'

import BayesLogo from '../images/bayes-logo.png'
import DMHCLogo from '../images/dmhc-logo.png'


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

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired,
  };

  render() {
    const {isOpen, onCloseClick} = this.props
    const actions = [
      <FlatButton label="Close" primary={true} onClick={onCloseClick} />,
    ];
    const bayesLink = <SecureLink href="https://bayesimpact.org">
      Bayes Impact
    </SecureLink>
    const dmhcLink = <SecureLink href="http://www.dmhc.ca.gov/">
      Department of Managed Health Care
    </SecureLink>
    return (
      <Dialog
          title="About"
          autoScrollBodyContent={true}
          open={isOpen}
          onRequestClose={onCloseClick}
          actions={actions}>
        <div>
          <div style={{height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img style={{height: 140}} src={BayesLogo} />
            <img style={{height: 80, marginLeft: 30}} src={DMHCLogo} />
          </div>
          <p>
            This web app was built by {bayesLink} for the {dmhcLink} (DMHC)
            to measure and analyze health plan network adequacy in the state
            of California.
          </p>
          <p>
            This application can be used by DMHC analysts to generate reports
            of representative population points for zip codes in California.
            The user can adjust parameters including the number of points,
            specific zip codes/counties and then download the results in a
            CSV file. These results can be viewed in either a table or a map format.
          </p>
          <p>
            The user can also upload CSV files for display in the app.
            These CSV files can be uploaded in one of three formats:
            zip codes only, counties only, or zip code and county pairs.
          </p>
        </div>
      </Dialog>
    );
  }
}

const SecureLink = ({href, children}) => {
  const style = {
    color: indigo500,
    lineHeight: '20px',
  }
  return (
    <a style={style} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}


export default Header
