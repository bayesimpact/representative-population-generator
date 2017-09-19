
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
        }
      })
    }, 2000)
  })
}
