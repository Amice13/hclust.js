# hclust.js - Agglomerative hierarchical clustering for Node JS

## Description

Agglomerative hierarchical clustering for Node JS (no dependencies). 

## Parameters

Method can be called by `hclust(arrays, distanceType = 'euclidean', linkageType = 'average', na = 'pairwise', arrayMin, arrayMax)`, where

* `arrays` - list of arrays to calculate clusters
* `distanceType` - distance measures

  * **euclidean** (default) - Eucledian distance, usual distance between the two vectors
  * **maximum** - maximum distance between two components of x and y 
  * **canberra** - sum(|x_i - y_i| / |x_i + y_i|)
  * **manhattan** - absolute distance between the two vectors
  * **percent** - percent of similarity between vectors, based on possible maximum difference between vectors 
  * **cosine** - cosine similarity
  * **angular** - angular similarity
  * **pearson** - Pearson correlation based distance
  * **spearman** - Spearman correlation based distance

* `linkageType` - linkage method

  * **single** - Method of single linkage or nearest neighbour. Proximity between two clusters is the proximity between their two closest objects.
  * **complete** - Method of complete linkage or farthest neighbour. Proximity between two clusters is the proximity between their two most distant objects.
  * **average** (default) - Simple average, or method of equilibrious between-group average linkage (WPGMA) is the modified previous. Proximity between two clusters is the arithmetic mean of all the proximities between the objects of one, on one side, and the objects of the other, on the other side; while the subclusters of which each of these two clusters were merged recently have equalized influence on that proximity – even if the subclusters differed in the number of objects.

* `na` - handling missing data (they must be null)
  
  * **pairwise** (default) - pairwise deletion of missing values

* `arrayMin`, `arrayMax` - range or your variable for calculation of percent difference, otherwise their values will be found in data

## Installation

```bash
npm install hclust --save
```

## Usage

```js
const hclust = require('hclust')

let arrays = [[5,2,1,4,1,6,2], [1,5,3,5,5,6,1], [6,2,7,7,5,6,7], [1,2,3,4,6,6,7]]
let clusters = hclust(arrays)
console.log(clusters)

```

Expected outcome:

<pre>
[
  {
    "elements": [
      [
        [
          0
        ],
        [
          1
        ]
      ],
      [
        [
          2
        ],
        [
          3
        ]
      ]
    ],
    "distance": 8.509116724833937
  },
  {
    "elements": [
      [
        2
      ],
      [
        3
      ]
    ],
    "distance": 7.14142842854285
  },
  {
    "elements": [
      [
        0
      ],
      [
        1
      ]
    ],
    "distance": 6.855654600401044
  }
]

</pre>

## Alternatives

[hcluster.js](https://github.com/cmpolis/hcluster.js) - Agglomerative Hierarchical Clustering in JavaScript. (that plays nice with d3.js).

[ml-hclust](https://www.npmjs.com/package/ml-hclust) - Hierarchical clustering algorithms in JavaScript (includes divisive analysis).

## License

MIT
