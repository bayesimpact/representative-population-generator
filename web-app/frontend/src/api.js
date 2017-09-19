
// TODO: Request data from backend when endpoint exists.
export function getCounties() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        sanFrancisco: [94102, 94103, 94104],
        alemeda: [94605, 94606],
      })
    }, 2000)
  })
}
