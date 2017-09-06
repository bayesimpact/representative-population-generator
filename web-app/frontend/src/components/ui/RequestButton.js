import React from 'react';
import Button from './Button.js';
import { getThing } from '../../api/api.js';

export default class RequestButton extends Button {
  //todo .then(function(response){console.log(JSON.stringify(response))*/
  render(){
    return (
      <button style={{backgroundColor: 'cyan'}} onClick={
        () => getThing().then(function (response) {
          response.json().then(function (data) {
            alert(JSON.stringify(data, null, ' '));
          });
        })
      }>
        sendddd
      </button>
    );
  }
}
