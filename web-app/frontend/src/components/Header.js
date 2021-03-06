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
        <div style={headingStyle}>Representative Population Generator</div>
        <CurrentVersionNotice />
        <div style={{flex: 1}} />
        <FlatButton
            label="About"
            onClick={() => this.setState({isAboutDialogOpen: true})}
            style={{color: '#fff'}} />
        <FlatButton
            href="https://github.com/bayesimpact/representative-population-generator"
            target="_blank"
            style={{color: '#fff'}}
            icon={<GithubIcon />} />
      </div>
    )
  }
}


const CurrentVersionNotice = () => (
  process.env.REACT_APP_VERSION && <div style={{marginLeft: 10}}>({process.env.REACT_APP_VERSION})</div>
)


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
      California Department of Managed Health Care
    </SecureLink>
    const githubLink = <SecureLink href="https://github.com/bayesimpact/representative-population-generator">
      Github page

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
            <img alt="bayes-logo" style={{height: 140}} src={BayesLogo} />
            <img alt="dmhc-logo" style={{height: 80, marginLeft: 30}} src={DMHCLogo} />
          </div>
          <p>
          The Representative Population Generator web application was built by {bayesLink} in
          partnership with {dmhcLink} (DMHC). The application generates representative population
          points for the State of California based on United States Postal Service (USPS) mailing
          addresses and Census data. 
          </p>
          <p>
          The primary intent for this project is to assist health and policy analysts at the DMHC
          in measuring the network adequacy of health plans. Network adequacy is a measure that
          ensures health plans have enough physicians, hospitals, clinics, and other providers to
          allow plan enrollees access to the right doctor within a reasonable distance from home or
          work. The representative population points generated by the application will be used to
          calculate the distance and travel time for enrollees to access health care services. 
          </p>
          <p>
          Please visit our {githubLink} for more information.
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
