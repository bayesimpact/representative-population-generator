import * as api from './api'

export const START_REQUEST = 'START_REQUEST'
export const FINISH_REQUEST = 'FINISH_REQUEST'
export const SET_APP_VARIABLE = 'SET_APP_VARIABLE'

function setAppVariableAction(variable, value) {
  return {type: SET_APP_VARIABLE, value, variable}
}

function startRequestAction(resource) {
  return {type: START_REQUEST, resource}
}

function finishRequestAction(resource, result) {
  return {type: FINISH_REQUEST, resource, result}
}

export const fetchCounties = () => dispatch => {
  dispatch(startRequestAction('counties'))
  api.getCounties().then(counties => {
    dispatch(finishRequestAction('counties', counties))
  })
}

export const fetchAreas = selectedCountyZips => dispatch => {
  dispatch(setAppVariableAction('selectedCSVFileName', ''))
  dispatch(startRequestAction('areas'))
  const countyZipObjects = countyZipsToObjects(selectedCountyZips)
  api.getAreas(countyZipObjects).then(areas => {
    dispatch(finishRequestAction('areas', areas))
  })
}

function countyZipsToObjects(selectedCountyZips) {
  return selectedCountyZips.map(countyZip => {
    const [county, zip] = countyZip.split('-')
    return {county, zip}
  })
}

export const fetchAreasFromCSVFile = file => dispatch => {
  dispatch(setAppVariableAction('selectedCSVFileName', file.name))
  dispatch(startRequestAction('areas'))
  api.getAreasFromFile(file).then(areas => {
    dispatch(finishRequestAction('areas', areas))
    const missingAreas = getUnavailableServiceAreas(areas)
    dispatch(setAppVariableAction('missingAreas', missingAreas))
  })
}

function getUnavailableServiceAreas(areas) {
  return areas.reduce((accu, area) => {
    return area.availability_status.is_service_area_available ?
      accu : accu.concat([area.area_info])
  }, [])
}

export function setSelectedCounties(selectedCounties) {
  return setAppVariableAction('selectedCounties', selectedCounties)
}

export function setSelectedCountyZips(selectedCountyZips) {
  return setAppVariableAction('selectedCountyZips', selectedCountyZips)
}

export function setViewMode(viewMode) {
  return setAppVariableAction('viewMode', viewMode)
}

export function setPointNumber(nPoints) {
  return setAppVariableAction('nPoints', nPoints)
}

export const resetAreaSelector = () => dispatch => {
  dispatch(setSelectedCounties([]))
  dispatch(setSelectedCountyZips([]))
}

export function resetMissingAreas() {
  return setAppVariableAction('missingAreas', [])
}
