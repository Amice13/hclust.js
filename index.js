function hclust (arrays, distance = 'euclidean', linkage = 'average', na = 'pairwise') {
  // Get initial distance matrix
  let distanceMatrix = dist(arrays, distance, na)

  // Calculate clusters
  let clusters = []
  let elements = [...Array(arrays.length).keys()].map(el => [el])
  while (elements.length !== 1) {
    let distances = []
    let i
    i = 0
    while (i < elements.length) {
      let x, y
      let j = i + 1
      while (j < elements.length) {
        x = flattenDeep(elements[i])
        y = flattenDeep(elements[j])
        let cluster = [elements[i], elements[j]]
        let d = distanceMatrix.filter(el => intersection(el.elements, x).length > 0 && intersection(el.elements, y).length > 0)
        d = d.map(el => el.distance)
        switch (linkage) {
          case 'single':
            d = Math.min(...d)
            break
          case 'complete':
            d = Math.max(...d)
            break
          case 'average':
            d = sum(d) / d.length
            break
          default:
            d = null
        }
        distances.push({ elements: cluster, distance: d, indicies: [i, j] })
        j += 1
      }
      i += 1
    }
    let rawDistances = distances.map(el => el.distance)
    let min = Math.min(...rawDistances)
    let cluster = distances[rawDistances.indexOf(min)]
    elements = elements.filter((value, index) => !cluster.indicies.includes(index))
    delete cluster.indicies
    clusters.unshift(cluster)
    elements.push(cluster.elements)
  }
  return clusters
}

// Helper functions

function sum (x) {
  return x.reduce((a, b) => a + b)
}

function product (x, y) {
  return x.map((value, index) => (x[index] * y[index]))
}

function dotProduct (x, y) {
  return sum(product(x, y))
}

function mean (x) {
  return sum(x) / x.length
}

function residuals (x) {
  return x.map(el => el - mean(x))
}

function variation (x) {
  let suaredResiduals = x.map(el => Math.pow(el - mean(x), 2))
  return sum(suaredResiduals) / (x.length - 1)
}

function sd (x) {
  return Math.pow(variation(x), 0.5)
}

function flattenDeep (arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), [])
}

function intersection (array1, array2) {
  return array1.filter(value => array2.indexOf(value) !== -1)
}

function arrayToRanks (x) {
  let sortedArray = [...x].sort((a, b) => a - b)
  // Initial ranks
  let ranksArray = x.map(el => sortedArray.indexOf(el) + 1)
  // Fix tied ranks
  let tied = {}
  for (let r of [...new Set(ranksArray)]) {
    let len = ranksArray.filter(el => el === r).length
    tied[r] = len === 1 ? r : sum([...Array(len).keys()].map(el => el + r)) / len
  }
  ranksArray = ranksArray.map(el => tied[el])
  return ranksArray
}

// Distance functuins

function pearson (x, y) {
  return dotProduct(residuals(x), residuals(y)) / (sd(x) * sd(y) * x.length)
}

function spearman (x, y) {
  let rankedX = arrayToRanks(x)
  let rankedY = arrayToRanks(y)
  let squaredRankDifferece = rankedX.map((value, index) => Math.pow(rankedX[index] - rankedY[index], 2))
  return 1 - 6 * (sum(squaredRankDifferece) / (Math.pow(x.length, 3) - x.length))
}

function cosineSimilarity (x, y) {
  return dotProduct(x, y) / (Math.pow(dotProduct(x, x), 0.5) * Math.pow(dotProduct(y, y), 0.5))
}

function angular (x, y) {
  return 2 * Math.acos(cosineSimilarity(x, y)) / Math.PI
}

function dist (arrays, distance = 'euclidean', na, min, max) {
  // Calculate inital distance matrix
  let distanceMatrix = []
  let i = 0
  let maxDifference
  if (distance === 'percent') {
    let allValues = flattenDeep(arrays)
    min = Math.min(...allValues)
    max = Math.max(...allValues)
    maxDifference = (max - min) * arrays.length
  }
  while (i < arrays.length) {
    let j = i + 1
    while (j < arrays.length) {
      let elements = [i, j]
      let arrayDistance, elementsDistance
      let x = arrays[i]
      let y = arrays[j]

      // Remove null values
      if (na === 'pairwise' && x.length && y.length) {
        let naFilter = x.map((value, index) => x[index] === null && y[index] === null)
        x = x.filter((value, index) => !naFilter[index])
        y = y.filter((value, index) => !naFilter[index])
      }
      if (!x.length || !y.length) return false

      switch (distance) {
        case 'euclidean':
          elementsDistance = x.map((value, index) => Math.pow(x[index] - y[index], 2))
          arrayDistance = Math.pow(sum(elementsDistance), 0.5)
          break
        case 'maximum':
          elementsDistance = x.map((value, index) => Math.abs(x[index] - y[index]))
          arrayDistance = Math.max(...elementsDistance)
          break
        case 'canberra':
          elementsDistance = x.map((value, index) => Math.abs(x[index] - y[index]) / Math.abs(x[index] + y[index]))
          arrayDistance = sum(elementsDistance)
          break
        case 'manhattan':
          elementsDistance = x.map((value, index) => Math.abs(x[index] - y[index]))
          arrayDistance = sum(elementsDistance)
          break
        case 'percent':
          elementsDistance = x.map((value, index) => Math.abs(x[index] - y[index]))
          arrayDistance = (maxDifference - sum(elementsDistance)) * 100 / maxDifference
          break
        case 'cosine':
          arrayDistance = cosineSimilarity(x, y)
          break
        case 'angular':
          arrayDistance = angular(x, y)
          break
        case 'pearson':
          arrayDistance = 1 - pearson(x, y)
          break
        case 'spearman':
          arrayDistance = 1 - spearman(x, y)
          break
        default:
          arrayDistance = null
      }
      distanceMatrix.push({ elements, distance: arrayDistance })
      j += 1
    }
    i += 1
  }
  return distanceMatrix
}

module.exports = hclust