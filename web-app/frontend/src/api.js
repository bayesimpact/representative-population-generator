
// TODO: Request data from backend when endpoint exists.
export function getCounties() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        sanFrancisco: {
          displayName: 'San Francisco',
          zips: [94102, 94103, 94104],
        },
        alemeda: {
          displayName: 'Alameda',
          zips: [94605, 94606],
        },
      })
    }, 2)
  })
}

export function getAreas(countyZips) {
  return fetch('http://localhost/areas?zipcounties=' + JSON.stringify(countyZips))
  .then(response => response.json())
  .then(response => response.result)
}

export function getAreasFromFile(file) {
  const data = new FormData()
  data.append('zipcounty_file', file)

  return fetch('http://localhost/areas', {
      method: 'POST',
      body: data
    })
  .then(response => response.json())
  .then(response => response.result)
}
