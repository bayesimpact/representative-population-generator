
export function getAllPoints(areas=[], nPointsPerArea) {
  const points = [];
  areas.forEach(area => {
    area.points.slice(0, nPointsPerArea).forEach(point => {
      points.push({
        zipCode: point.properties.zip,
        county: point.properties.county,
        longitude: point.geometry.coordinates[0],
        latitude: point.geometry.coordinates[1],
        nResidents: Math.round(point.properties.population),
      })
    })
  })
  return points
}
