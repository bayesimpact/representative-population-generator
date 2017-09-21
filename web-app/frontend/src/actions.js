import * as api from './api'

export const FETCH_COUNTIES = 'FETCH_COUNTIES'
export const START_REQUEST = 'START_REQUEST'
export const FINISH_REQUEST = 'FINISH_REQUEST'
export const SET_APP_VARIABLE = 'SET_APP_VARIABLE'


export const fetchCounties = () => dispatch => {
  dispatch({type: START_REQUEST, resource: 'counties'})
  api.getCounties().then(counties => {
    dispatch({
      type: FINISH_REQUEST,
      resource: 'counties',
      result: counties,
    })
  })
}

export const fetchAreas = selectedCountyZips => dispatch => {
  dispatch({
    type: SET_APP_VARIABLE,
    value: '',
    variable: 'selectedCSVFileName',
  })
  dispatch({type: START_REQUEST, resource: 'areas'})
  const countyZips = selectedCountyZips.map(countyZip => {
    const [county, zip] = countyZip.split('-')
    return {county, zip}
  })
  api.getAreas(countyZips).then(areas => {
    dispatch({
      type: FINISH_REQUEST,
      resource: 'areas',
      result: areas,
    })
  })
}

export const fetchAreasFromCSVFile = file => dispatch => {
  dispatch({
    type: SET_APP_VARIABLE,
    value: file.name,
    variable: 'selectedCSVFileName',
  })
  dispatch({type: START_REQUEST, resource: 'areas'})
  api.getAreasFromFile(file).then(areas => {
    dispatch({
      type: FINISH_REQUEST,
      resource: 'areas',
      result: areas,
    })
  })
}

export function setSelectedCounties(selectedCounties) {
  return {
    type: SET_APP_VARIABLE,
    value: selectedCounties,
    variable: 'selectedCounties',
  }
}

export function setSelectedCountyZips(selectedCountyZips) {
  return {
    type: SET_APP_VARIABLE,
    value: selectedCountyZips,
    variable: 'selectedCountyZips',
  }
}

export function setViewMode(viewMode) {
  return {
    type: SET_APP_VARIABLE,
    value: viewMode,
    variable: 'viewMode',
  }
}

export function setPointNumber(nPoints) {
  return {
    type: SET_APP_VARIABLE,
    value: nPoints,
    variable: 'nPoints',
  }
}

export const resetAreaSelector = () => dispatch => {
  dispatch(setSelectedCounties([]))
  dispatch(setSelectedCountyZips([]))
}
