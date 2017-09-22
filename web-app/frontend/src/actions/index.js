export const REQUEST_POINTS = 'REQUEST_POINTS'
export const RECEIVE_POINTS = 'RECEIVE_POINTS'
export const SELECT_ZIPCOUNTY = 'SELECT_ZIPCOUNTY'
export const UPLOAD_ZIPCOUNTY = 'UPLOAD_ZIPCOUNTY'

const API_URL = window.location.href.slice(0, -1)+ ':8080'

export const selectZipCounty = zipcounty => ({
  type: SELECT_ZIPCOUNTY,
  zipcounty
})


export const uploadZipCountyFile = zipcountyFile => dispatch => {
  return 
}

export const requestPointAs = zipcounty => ({
  type: REQUEST_POINTS,
  zipcounty
})

const concat_arrays = array_2d => {
  var new_arr = []
  for(var i = 0; i < array_2d.length; i++){
    if (array_2d[i].availabilityStatus.isServiceAreaAvailable) {
      new_arr = new_arr.concat(array_2d[i].points)
    }
  }
  return new_arr
}

export const receivePointAs = (zipcounty, json) => ({
  type: RECEIVE_POINTS,
  zipcounty,
  pointas: concat_arrays(json.result),
  receivedAt: Date.now()
})

export const uploadDocumentRequest = ( {document, name} ) => dispatch => { 
  dispatch(selectZipCounty("from file"))
  dispatch(requestPointAs("from file"))
  let data = new FormData()
  data.append('zipcounty_file', document)
  data.append('name', name)

  return fetch(API_URL + '/areas', {
      method: 'POST',
      body: data
    })
  .then(response => response.json())
  .then(json => dispatch(receivePointAs("from file", json)))
}

const fetchPointAs = zipcounty => dispatch => {
  dispatch(requestPointAs(zipcounty))
  return fetch(API_URL + `/areas?zipcounties=${zipcounty}`)
    .then(
      response => response.json(),
      error => console.log('An error occured.', error))
    .then(json => dispatch(receivePointAs(zipcounty, json)))
}

const shouldFetchPointAs = (state, zipcounty) => {
  const pointas = state.pointasFetched[zipcounty]
  if (!pointas) {
    return true
  }
  if (pointas.isFetching) {
    return false
  }
  return pointas.didInvalidate
}

export const fetchPointAsIfNeeded = zipcounty => (dispatch, getState) => {
  if (shouldFetchPointAs(getState(), zipcounty)) {
    return dispatch(fetchPointAs(zipcounty))
  }
}
