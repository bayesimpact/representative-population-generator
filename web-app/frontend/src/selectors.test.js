import {getAllPointsCollection, getGroupedPoints} from './containers/mapViewSelectorHelpers'
import {getAllPoints} from './containers/tableViewSelectorHelpers'

it('should limit the number of points per area in the all points collection', () => {
  const areas = [
    {points: [1, 2, 3]},
    {points: [1, 2, 3, 4]},
  ]
  const nPointsPerArea = 2
  const res = getAllPointsCollection(areas, nPointsPerArea)
  expect(res.features.length).toBe(4)
})

it('should group the points from a list of areas correctly', () => {
  const areas = [
    {points: [1, 2, 3]},
    {points: [1, 2, 3, 4]},
  ]
  const nGroups = 2
  const nPointsPerArea = 2
  const res = getGroupedPoints(areas, nGroups, nPointsPerArea)
  expect(Object.keys(res).length).toBe(nGroups)
  expect(res[0].length).toBe(2)
  expect(res[1].length).toBe(2)
})

it('should limit the number of points per area in the list of all points', () => {
  const areas = [
    {
      points: [
        {
          properties: {zip: '12345', county: 'bla', population: 200},
          geometry: {coordinates: [1, 2]},
        },
        {
          properties: {zip: '12345', county: 'bla', population: 200},
          geometry: {coordinates: [1, 2]},
        }
      ]
    },
    {
      points: [
        {
          properties: {zip: '12345', county: 'bla', population: 200},
          geometry: {coordinates: [1, 2]},
        },
      ]
    }
  ]
  const nPointsPerArea = 1
  const res = getAllPoints(areas, nPointsPerArea)
  expect(res.length).toBe(2)

})
