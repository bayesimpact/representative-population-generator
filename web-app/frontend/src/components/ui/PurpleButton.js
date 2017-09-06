import React from 'react';
import Button from './Button.js';
import RaisedButton from 'material-ui/RaisedButton';

export default class PurpleButton extends Button {

  constructor() {
    super();
    this.state = {color: true};
  }

  changeColor(){
    this.setState({color: !this.state.color});
  }

  render(){
    let color = this.state.color ? "#9C27B0" : "#FF9800";
    return (
        <RaisedButton backgroundColor={color} onClick={() => this.changeColor()}>
            My name is {color} {this.props.name}
        </RaisedButton>
        );
  }
}
