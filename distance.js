const { sum, dotProduct, pearson, spearman } = require('./helpers')
const { min, max, abs, pow, acos, PI } = Math

function euclidean (x, y) {
  let elementsDistance = x.map((value, index) => pow(x[index] - y[index], 2))
  return pow(sum(elementsDistance), 0.5)
}

function maximum (x, y) {
  let elementsDistance = x.map((value, index) => abs(x[index] - y[index]))
  return max(...elementsDistance)
}

function canberra (x, y) {
  let elementsDistance = x.map((value, index) => abs(x[index] - y[index]) / (abs(x[index]) + abs(y[index])))
  return sum(elementsDistance)
}

function manhattan (x, y) {
  let elementsDistance = x.map((value, index) => abs(x[index] - y[index]))
  return sum(elementsDistance)
}

function percent (x, y, maxDifference) {
  let elementsDistance = x.map((value, index) => abs(x[index] - y[index]))
  return (maxDifference - sum(elementsDistance)) * 100 / maxDifference
}

function cosine (x, y) {
  return dotProduct(x, y) / (pow(dotProduct(x, x), 0.5) * pow(dotProduct(y, y), 0.5))
}

function angular (x, y) {
  return 2 * acos(cosine(x, y)) / PI
}

function pearsonDistance (x, y) {
  return 1 - pearson(x, y)
}

function spearmanDistance (x, y) {
  return 1 - spearman(x, y)
}

module.exports = {
  euclidean,
  maximum,
  canberra,
  manhattan,
  percent,
  cosine,
  angular,
  pearson: pearsonDistance,
  spearman: spearmanDistance
}
