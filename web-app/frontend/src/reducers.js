
import {START_REQUEST, FINISH_REQUEST} from './actions'

const initialState = {
  isLoading: {},
  data: {},
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
    default:
      return state
  }
}
