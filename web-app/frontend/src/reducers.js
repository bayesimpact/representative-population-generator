
import {
  START_REQUEST,
  FINISH_REQUEST,
  SET_APP_VARIABLE,
  SET_COUNTY,
  REMOVE_COUNTY,
  SET_COUNTY_ZIP,
  REMOVE_COUNTY_ZIP,
  SET_SELECT_ALL_CHECKED,
  SET_SELECT_ALL_UNCHECKED,
} from './actions'

const initialState = {
  isLoading: {
    areas: false,
    counties: true,
  },
  data: {},
  app: {
    selectedCounties: [],
    selectedCountyZips: [],
    viewMode: 'map',
    nPoints: 50,
    missingAreas: [],
    selectedCSVFileName: '',
    snackMessage: '',
    isSelectAllChecked: false,
  },
}

export function mainReducer(state=initialState, action) {
  const {selectedCounties, selectedCountyZips} = state.app
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
      const newSelectedCounties = selectedCounties.includes(action.county) ?
        [...selectedCounties] :
        selectedCounties.concat([action.county])
      let newSelectedCountyZips = [...selectedCountyZips]
      if (state.app.isSelectAllChecked) {
        newSelectedCountyZips = getAllZipsForCounties(newSelectedCounties, state.data.counties)
      }
      return {
        ...state,
        app: {
          ...state.app,
          selectedCounties: newSelectedCounties,
          selectedCountyZips: newSelectedCountyZips,
        },
      }
    case REMOVE_COUNTY:
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
    case SET_COUNTY_ZIP:
      return {
        ...state,
        app: {
          ...state.app,
          selectedCountyZips: selectedCountyZips.concat([action.countyZip]),
        },
      }
    case REMOVE_COUNTY_ZIP:
      return {
        ...state,
        app: {
          ...state.app,
          selectedCountyZips: selectedCountyZips.filter(countyZip => {
            return countyZip !== action.countyZip
          }),
        },
      }
    case SET_SELECT_ALL_CHECKED:
      return {
        ...state,
        app: {
          ...state.app,
          isSelectAllChecked: true,
          selectedCountyZips: getAllZipsForCounties(selectedCounties, state.data.counties)
        }
      }
    case SET_SELECT_ALL_UNCHECKED:
      return {
        ...state,
        app: {
          ...state.app,
          isSelectAllChecked: false,
          selectedCountyZips: [],
        }
      }
    default:
      return state
  }
}


const getAllZipsForCounties = (selectedCounties, counties) => {
  return selectedCounties.reduce((accu, selectedCounty) => {
    const countyZips = counties[selectedCounty].zips.map(zip => {
      return selectedCounty + '-' + zip
    })
    return accu.concat(countyZips)
  }, [])
}
