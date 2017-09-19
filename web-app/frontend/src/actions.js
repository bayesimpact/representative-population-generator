import {getCounties, getAreas} from './api'

export const FETCH_COUNTIES = 'FETCH_COUNTIES'
export const START_REQUEST = 'START_REQUEST'
export const FINISH_REQUEST = 'FINISH_REQUEST'

export const fetchCounties = () => dispatch => {
  dispatch({type: START_REQUEST, resource: 'counties'})
  getCounties().then(counties => {
    dispatch({
      type: FINISH_REQUEST,
      resource: 'counties',
      result: counties,
    })
  })
}

export const fetchAreas = countyZips => dispatch => {
  dispatch({type: START_REQUEST, resource: 'areas'})
  getAreas(countyZips).then(areas => {
    dispatch({
      type: FINISH_REQUEST,
      resource: 'areas',
      result: areas,
    })
  })
}
