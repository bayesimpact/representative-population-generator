
import {START_REQUEST, FINISH_REQUEST, SET_APP_VARIABLE} from './actions'

const initialState = {
  isLoading: {
    areas: false,
    counties: true,
  },
  data: {},
  app: {
    selectedCounties: ['sanFrancisco'],
    selectedCountyZips: ['sanFrancisco-94103'],
    viewMode: 'table',
    nPoints: 50,
  },
}

export function mainReducer(state=initialState, action) {
  switch (action.type) {
    case START_REQUEST:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.resource]: true,
        }
      }
    case FINISH_REQUEST:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.resource]: false,
        },
        data: {
          ...state.data,
          [action.resource]: action.result,
        }
      }
    case SET_APP_VARIABLE:
      return {
        ...state,
        app: {
          ...state.app,
          [action.variable]: action.value,
        }
      }
    default:
      return state
  }
}
