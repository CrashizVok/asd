'use strict';

// Linear search: check every item until it matches.
// O(n) time, O(1) space. Works on unsorted data.
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Binary search, iterative: halve a sorted range each step.
// O(log n) time, O(1) space. Input must be sorted ascending.
function binarySearchIterative(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1); // avoids overflow in other languages
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// Binary search, recursive: same halving, done through the call stack.
// O(log n) time, O(log n) stack space.
function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, hi);
  return binarySearchRecursive(arr, target, lo, mid - 1);
}

// Lower bound: first index whose value is >= target.
// Returns arr.length when every item is smaller. O(log n) time.
function lowerBound(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// Demo
const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log('array   ', sorted);
console.log('linearSearch 7        ->', linearSearch(sorted, 7));
console.log('linearSearch 8        ->', linearSearch(sorted, 8));
console.log('binarySearchIterative 11 ->', binarySearchIterative(sorted, 11));
console.log('binarySearchRecursive 1  ->', binarySearchRecursive(sorted, 1));
console.log('binarySearchRecursive 4  ->', binarySearchRecursive(sorted, 4));
console.log('lowerBound 7          ->', lowerBound(sorted, 7));
console.log('lowerBound 8          ->', lowerBound(sorted, 8));
console.log('lowerBound 20         ->', lowerBound(sorted, 20));

module.exports = { linearSearch, binarySearchIterative, binarySearchRecursive, lowerBound };
