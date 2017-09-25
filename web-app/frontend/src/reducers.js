
import {
  START_REQUEST,
  FINISH_REQUEST,
  SET_APP_VARIABLE,
  SET_COUNTY,
  REMOVE_COUNTY,
} from './actions'

const initialState = {
  isLoading: {
    areas: false,
    counties: true,
  },
  data: {},
  app: {
    selectedCounties: ['Alameda'],
    selectedCountyZips: ['Alameda-94530', 'Alameda-94501'],
    viewMode: 'map',
    nPoints: 50,
    missingAreas: [],
    selectedCSVFileName: '',
    snackMessage: '',
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
    case SET_COUNTY:
      return {
        ...state,
        app: {
          ...state.app,
          selectedCounties: state.app.selectedCounties.concat([action.county]),
        },
      }
    case REMOVE_COUNTY:
      const {selectedCounties, selectedCountyZips} = state.app
      return {
        ...state,
        app: {
          ...state.app,
          selectedCounties: selectedCounties.filter(county => {
            return county !== action.county
          }),
          selectedCountyZips: selectedCountyZips.filter(countyZip => {
            return !countyZip.startsWith(action.county)
          }),
        },
      }
    default:
      return state
  }
}
