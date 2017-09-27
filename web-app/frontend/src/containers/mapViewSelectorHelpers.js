import bbox from 'geojson-bbox'

export function getAllPointsCollection(areas=[], nPointsPerArea) {
  const allPoints = areas.reduce((accu, area) => {
    return accu.concat(area.points.slice(0, nPointsPerArea))
  }, [])
  return {
    type: 'FeatureCollection',
    features: allPoints
  }
}

export function getBoundingBoxCoordinates(featureCollection) {
  let boundingBoxCoordinates = null
  if (featureCollection.features.length) {
    const boundingBox = bbox(featureCollection)
    boundingBoxCoordinates = [
      [boundingBox[0], boundingBox[1]],
      [boundingBox[2], boundingBox[3]],
    ]
  }
  return boundingBoxCoordinates
}

export function getGroupedPoints(areas=[], nGroups, nPointsPerArea) {
  return areas.reduce((accu, area, i) => {
    const groupIndex = i % nGroups
    const group = accu[groupIndex] || []
    accu[groupIndex] = group.concat(area.points.slice(0, nPointsPerArea))
    return accu
  }, {})
}
