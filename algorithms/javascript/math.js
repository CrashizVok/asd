'use strict';

// Greatest common divisor with Euclid's algorithm.
// O(log min(a, b)) time, O(1) space.
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Least common multiple: divide before multiplying to keep numbers smaller.
// O(log min(a, b)) time, same as gcd.
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b);
}

// Sieve of Eratosthenes: mark multiples of each prime as composite.
// O(n log log n) time, O(n) space. Returns all primes up to n.
function sieve(n) {
  if (n < 2) return [];
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let m = i * i; m <= n; m += i) isPrime[m] = false;
  }
  const primes = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
  return primes;
}

// Fast exponentiation: square the base and halve the exponent.
// O(log exp) time, O(1) space. Works for big integers too.
function fastPow(base, exp) {
  if (!Number.isInteger(exp) || exp < 0) {
    throw new RangeError('fastPow expects a non-negative integer exponent');
  }
  let result = 1n;
  let b = BigInt(base);
  let e = BigInt(exp);
  const two = 2n;
  while (e > 0n) {
    if (e % two === 1n) result *= b;
    b *= b;
    e /= two;
  }
  return result;
}

// Prime test by trial division up to the square root.
// O(sqrt(n)) time, O(1) space. Good enough for exam sized numbers.
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

// Fibonacci, iterative: keep the last two values only.
// O(n) time, O(1) space. Exact up to n = 78 with normal numbers.
function fibonacciIterative(n) {
  if (n < 0) throw new RangeError('fibonacci needs a non-negative integer');
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}

// Demo
console.log('gcd(48, 18)          ->', gcd(48, 18));
console.log('lcm(4, 6)            ->', lcm(4, 6));
console.log('sieve(50)            ->', sieve(50).join(' '));
console.log('fastPow(2, 10)       ->', fastPow(2, 10).toString());
console.log('fastPow(3, 0)        ->', fastPow(3, 0).toString());
console.log('isPrime(97)          ->', isPrime(97));
console.log('isPrime(91)          ->', isPrime(91));
console.log('fibonacciIterative(10) ->', fibonacciIterative(10));
console.log('fibonacciIterative(78) ->', fibonacciIterative(78));

module.exports = { gcd, lcm, sieve, fastPow, isPrime, fibonacciIterative };
