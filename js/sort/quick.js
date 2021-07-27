function partitioning(arr, left, right) {
  if (right <= left) return arr;

  const key = arr[left];
  let l = left;
  let r = right;
  while (l < r) {
    // 
    while (l < r && arr[r] >= key) {
      r--;
    }
    l < r && (arr[l] = arr[r]);
    while (l < r && arr[l] < key) {
      l++;
    }
    l < r && (arr[r] = arr[l]);
  }
  arr[l] = key;
  partitioning(arr, left, l - 1);
  partitioning(arr, l + 1, right);
  return arr;
}

module.exports = function quick(arr) {
  if (arr.length <= 1) return arr;
  if (arr.length === 2) {
    const [left, right] = arr;
    return left > right ? [right, left] : arr;
  }
  return partitioning(arr, 0, arr.length - 1);
}
