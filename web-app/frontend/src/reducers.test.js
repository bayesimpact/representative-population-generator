import React from 'react';
import ReactDOM from 'react-dom';
import {mainReducer} from './reducers';
import {removeCountyAction} from './actions'

it('removes all zips of a county when county gets remmoved', () => {
  const state = {
    app: {
      selectedCounties: ['Alameda'],
      selectedCountyZips: ['Alameda-94530', 'Alameda-94501'],
    }
  }
  const nextState = mainReducer(state, removeCountyAction('Alameda'))
  expect(nextState.app.selectedCountyZips.length).toBe(0)
});
