const { flattenDeep, intersection, sum } = require('./helpers')
const dist = require('./matrixDistance')
const { min, max } = Math

function hclust (arrays, distanceType = 'euclidean', linkageType = 'average', na = 'pairwise', arrayMin, arrayMax) {
  // Get initial distance matrix
  let distanceMatrix = dist(arrays, distanceType, na, arrayMin, arrayMax)
 
  // Calculate clusters
  let clusters = []
  let elements = [...Array(arrays.length).keys()].map(el => [el])
  while (elements.length !== 1) {
    let distances = []
    let i = 0
    while (i < elements.length) {
      let x, y
      let j = i + 1
      while (j < elements.length) {
        x = flattenDeep(elements[i])
        y = flattenDeep(elements[j])
        let cluster = [elements[i], elements[j]]
        let distance = distanceMatrix.filter(el => intersection(el.elements, x).length > 0 && intersection(el.elements, y).length > 0)
        distance = distance.map(el => el.distance)
        distance = linkageDistance[linkageType](distance)
        distances.push({ elements: cluster, distance, indices: [i, j] })
        j += 1
      }
      i += 1
    }
    let rawDistances = distances.map(el => el.distance)
    let minValue = min(...rawDistances)
    let cluster = distances[rawDistances.indexOf(minValue)]
    elements = elements.filter((value, index) => !cluster.indices.includes(index))
    delete cluster.indices
    clusters.unshift(cluster)
    elements.push(cluster.elements)
  }
  return clusters
}

const linkageDistance = {
  single: d => min(...d),
  complete: d => max(...d),
  average: d => sum(d) / d.length
}

module.exports = hclust
