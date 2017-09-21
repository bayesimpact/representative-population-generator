import React, {Component} from 'react'
import Slider from 'material-ui/Slider'

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
        <div>Number of points</div>
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

export default PointNumberSelector
