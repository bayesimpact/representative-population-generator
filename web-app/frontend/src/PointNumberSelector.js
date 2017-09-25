import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import Slider from 'material-ui/Slider'
import ActionInfo from 'material-ui/svg-icons/action/info'

import styles from './styles'


// Material UI uses a slider value between 0 and 1 which has to be mapped
// to the scale we want (max number of points).
const SLIDER_FACTOR = 200

class PointNumberSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value / SLIDER_FACTOR,
    }
  }

  handleSliderChange = (e, value) => {
    this.setState({value})
  }

  handleDragStop = () => {
    const {onChange} = this.props
    onChange && onChange(this.state.value * SLIDER_FACTOR)
  }

  render() {
    const {value} = this.state
    return (
      <div>
        <ReactTooltip id="points">
          <span>The number of points generated per service area</span>
        </ReactTooltip>
        <div>Number of points <TooltipIcon id="points" /></div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Slider
              value={value}
              min={0.05}
              step={0.005}
              style={{flex: 1}}
              onChange={this.handleSliderChange}
              onDragStop={this.handleDragStop}
              sliderStyle={{marginTop: 10, marginBottom: 10}} />
          <div style={{marginLeft: 15}}>
            {Math.round(value * SLIDER_FACTOR)}/{SLIDER_FACTOR}
          </div>
        </div>
      </div>
    )
  }
}

const TooltipIcon = ({id}) => {
  const style = {
    color: styles.secondaryText,
    width: 16,
    height: 16,
    verticalAlign: 'text-top',
  }
  return (
    <a data-tip data-for={id}>
      <ActionInfo style={style} />
    </a>
  )
}


export default PointNumberSelector
