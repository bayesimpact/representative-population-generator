import {getAllPointsCollection, getGroupedPoints} from './containers/mapViewSelectorHelpers'

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
