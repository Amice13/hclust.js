const { flattenDeep } = require('./helpers')
const { min, max } = Math
const calculateDistance = require('./distance')

function dist (arrays, distanceType = 'euclidean', na, arrayMin, arrayMax) {
  // Calculate inital distance matrix
  let distanceMatrix = []
  let i = 0
  let maxDifference
  if (arrayMin && arrayMax) maxDifference = (arrayMax - arrayMin) * arrays.length
  if (!maxDifference && distanceType === 'percent') {
    let allValues = flattenDeep(arrays)
    maxDifference = (max(...allValues) - min(...allValues)) * arrays.length
  }

  while (i < arrays.length) {
    let j = i + 1
    while (j < arrays.length) {
      let elements = [i, j]
      let x = arrays[i]
      let y = arrays[j]
      // Remove null values
      if (na === 'pairwise' && x.length && y.length) {
        let naFilter = x.map((value, index) => x[index] === null && y[index] === null)
        x = x.filter((value, index) => !naFilter[index])
        y = y.filter((value, index) => !naFilter[index])
      }
      if (!x.length || !y.length) return false
      let distance = calculateDistance[distanceType](x, y, maxDifference)
      distanceMatrix.push({ elements, distance })
      j += 1
    }
    i += 1
  }
  return distanceMatrix
}

module.exports = dist
