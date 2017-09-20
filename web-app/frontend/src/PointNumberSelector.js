import React, {Component} from 'react'
import Slider from 'material-ui/Slider'

class PointNumberSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value / 100,
    }
  }

  handleSliderChange = (e, value) => {
    this.setState({value})
  }

  handleDragStop = () => {
    const {onChange} = this.props
    onChange && onChange(this.state.value * 100)
  }

  render() {
    const {value} = this.state
    return (
      <div>
        <div>Number of points</div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Slider
              value={value}
              step={0.01}
              style={{flex: 1}}
              onChange={this.handleSliderChange}
              onDragStop={this.handleDragStop}
              sliderStyle={{marginTop: 10, marginBottom: 10}} />
          <div>{Math.round(value * 100)}/100</div>
        </div>
      </div>
    )
  }
}

export default PointNumberSelector
