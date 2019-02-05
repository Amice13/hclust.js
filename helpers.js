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
  let average = mean(x)
  return x.map(el => el - average)
}

function variation (x) {
  let average = mean(x)
  let squaredResiduals = x.map(el => Math.pow(el - average, 2))
  return sum(squaredResiduals) / (x.length)
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

function pearson (x, y) {
  return dotProduct(residuals(x), residuals(y)) / (sd(x) * sd(y) * x.length)
}

function spearman (x, y) {
  let rankedX = arrayToRanks(x)
  let rankedY = arrayToRanks(y)
  let squaredRankDifferece = rankedX.map((value, index) => Math.pow(rankedX[index] - rankedY[index], 2))
  return 1 - 6 * (sum(squaredRankDifferece) / (Math.pow(x.length, 3) - x.length))
}

module.exports = {
  sum,
  product,
  dotProduct,
  mean,
  residuals,
  variation,
  sd,
  flattenDeep,
  intersection,
  arrayToRanks,
  pearson,
  spearman
}
