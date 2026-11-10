'use strict';

// Factorial: n! = n * (n - 1)!. O(n) time, O(n) stack space.
function factorial(n) {
  if (n < 0) throw new RangeError('factorial needs a non-negative integer');
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Fibonacci with memoization: each value is computed once.
// O(n) time, O(n) space for the cache and the stack.
function fibonacci(n, memo = new Map()) {
  if (n < 0) throw new RangeError('fibonacci needs a non-negative integer');
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, value);
  return value;
}

// Tower of Hanoi: move n disks from source to target using a spare peg.
// Needs 2^n - 1 moves, so O(2^n) time and O(n) stack space.
// Pushes each move as a string into the moves array.
function towerOfHanoi(n, from = 'A', to = 'C', spare = 'B', moves = []) {
  if (n <= 0) return moves;
  towerOfHanoi(n - 1, from, spare, to, moves);
  moves.push(`${from} -> ${to}`);
  towerOfHanoi(n - 1, spare, to, from, moves);
  return moves;
}

// Sum of digits: strip the last digit, recurse on the rest.
// O(d) time for d digits, O(d) stack space.
function sumOfDigits(n) {
  n = Math.abs(n);
  if (n < 10) return n;
  return (n % 10) + sumOfDigits(Math.floor(n / 10));
}

// Reverse string: last character plus the reverse of everything before it.
// O(n^2) time here because each slice copies; O(n) stack space.
function reverseString(str) {
  if (str.length <= 1) return str;
  return str[str.length - 1] + reverseString(str.slice(0, -1));
}

// Demo
console.log('factorial(5)      ', factorial(5));
console.log('factorial(0)      ', factorial(0));
console.log('fibonacci(10)     ', fibonacci(10));
console.log('fibonacci(40)     ', fibonacci(40));
console.log('hanoi(3)          ', towerOfHanoi(3).join(', '));
console.log('sumOfDigits(9042) ', sumOfDigits(9042));
console.log('reverseString     ', reverseString('recursion'));

module.exports = { factorial, fibonacci, towerOfHanoi, sumOfDigits, reverseString };
