
export function getAllPoints(areas=[], nPointsPerArea) {
  const points = [];
  areas.forEach(area => {
    area.points.slice(0, nPointsPerArea).forEach(point => {
      points.push({
        zipCode: point.properties.zip,
        county: point.properties.county,
        population: Math.round(point.properties.population),
        longitude: point.geometry.coordinates[0],
        latitude: point.geometry.coordinates[1],
        censusTract: Math.round(point.properties.census_tract),
        censusBlockGroup: Math.round(point.properties.census_block_group),
      })
    })
  })
  return points
}
