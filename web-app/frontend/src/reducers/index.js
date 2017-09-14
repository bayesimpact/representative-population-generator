import { combineReducers } from 'redux'
import {
  SELECT_ZIPCOUNTY,
  REQUEST_POINTS, RECEIVE_POINTS
} from '../actions'

const selectedZipCounty = (state = '[{"county":"sanFrancisco","zip":"94102"}]', action) => {
  switch (action.type) {
    case SELECT_ZIPCOUNTY:
      return action.zipcounty
    default:
      return state
  }
}

const pointas = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_POINTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POINTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.pointas,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const pointasFetched = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POINTS:
    case REQUEST_POINTS:
      return {
        ...state,
        [action.zipcounty]: pointas(state[action.zipcounty], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  pointasFetched,
  selectedZipCounty
})

export default rootReducer
