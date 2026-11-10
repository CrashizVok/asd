'use strict';

// Bubble sort: swap neighbours until nothing moves.
// Worst and average O(n^2), best O(n) when already sorted, O(1) extra space.
function bubbleSort(input) {
  const a = input.slice();
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }
    if (!swapped) break; // the rest is sorted already
  }
  return a;
}

// Selection sort: pick the smallest remaining item and place it at the front.
// Always O(n^2) time, O(1) space, and few swaps.
function selectionSort(input) {
  const a = input.slice();
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

// Insertion sort: grow a sorted prefix by inserting each item into place.
// Average and worst O(n^2), best O(n), good for small or nearly sorted arrays.
function insertionSort(input) {
  const a = input.slice();
  for (let i = 1; i < a.length; i++) {
    const value = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > value) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = value;
  }
  return a;
}

// Merge sort: split in half, sort each half, merge the two sorted halves.
// O(n log n) time in every case, O(n) extra space.
function mergeSort(input) {
  if (input.length <= 1) return input.slice();
  const mid = Math.floor(input.length / 2);
  const left = mergeSort(input.slice(0, mid));
  const right = mergeSort(input.slice(mid));
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

// Quick sort: partition around a pivot, then sort both sides.
// Average O(n log n), worst O(n^2) when the pivot is always extreme, O(log n) stack.
function quickSort(input) {
  const a = input.slice();
  sortRange(a, 0, a.length - 1);
  return a;

  function sortRange(arr, lo, hi) {
    if (lo >= hi) return;
    const p = partition(arr, lo, hi);
    sortRange(arr, lo, p - 1);
    sortRange(arr, p + 1, hi);
  }

  // Lomuto partition with the last item as pivot.
  function partition(arr, lo, hi) {
    const pivot = arr[hi];
    let store = lo;
    for (let i = lo; i < hi; i++) {
      if (arr[i] < pivot) {
        [arr[i], arr[store]] = [arr[store], arr[i]];
        store++;
      }
    }
    [arr[store], arr[hi]] = [arr[hi], arr[store]];
    return store;
  }
}

// Demo
const data = [5, 2, 9, 1, 5, 6];
console.log('input            ', data);
console.log('bubbleSort       ', bubbleSort(data));
console.log('selectionSort    ', selectionSort(data));
console.log('insertionSort    ', insertionSort(data));
console.log('mergeSort        ', mergeSort(data));
console.log('quickSort        ', quickSort(data));
console.log('input untouched  ', data);

module.exports = { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort };
