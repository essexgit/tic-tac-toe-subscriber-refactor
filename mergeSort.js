function divideArray (shuffledArray) {
  if (shuffledArray.length <= 1) return shuffledArray
  let mid = Math.floor(shuffledArray.length / 2)
  let frontHalf = divideArray(shuffledArray.slice(0, mid))
  let backHalf = divideArray(shuffledArray.slice(mid))
  return mergingArrays(frontHalf, backHalf)
}

function mergingArrays (sortedArray1, sortedArray2) {
  let sortedArray = []
  let [i, j] = [0, 0]
  while (i < sortedArray1.length && j < sortedArray2.length) {
    if (sortedArray1[i] <= sortedArray2[j]) {
      sortedArray.push(sortedArray1[i])
      i++
      console.log(i)
    } else {
      sortedArray.push(sortedArray2[j])
      j++
      console.log(j)
    }
  }
  while (i < sortedArray1.length) {
    sortedArray.push(sortedArray1[i])
    i++
  }
  while (j < sortedArray2.length) {
    sortedArray.push(sortedArray2[j])
    j++
  }

  return sortedArray
}

let unSortedArray = [150, 190, 170, 160, 180]
// let unSortedArray = [6, 3, 5, 7, 9, 2, 4, 1, 16, 20, 18]
console.log(divideArray(unSortedArray))