'use strict';

// 0/1 knapsack: each item is taken once or not at all.
// dp[w] is the best value with capacity w. Fills from high to low so each item
// is used once. O(n * capacity) time, O(capacity) space.
function knapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}

// Longest common subsequence: table of prefix answers.
// O(n * m) time, O(n * m) space. Characters need not be adjacent.
function longestCommonSubsequence(a, b) {
  const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      table[i][j] = a[i - 1] === b[j - 1]
        ? table[i - 1][j - 1] + 1
        : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }
  return table[a.length][b.length];
}

// Edit distance (Levenshtein): insert, delete or replace one character.
// O(n * m) time, O(n * m) space.
function editDistance(a, b) {
  const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) table[i][0] = i;
  for (let j = 0; j <= b.length; j++) table[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1];
      } else {
        table[i][j] = 1 + Math.min(
          table[i - 1][j],     // delete
          table[i][j - 1],     // insert
          table[i - 1][j - 1], // replace
        );
      }
    }
  }
  return table[a.length][b.length];
}

// Coin change: fewest coins that add up to amount.
// dp[x] is the minimum for x, built bottom up. O(amount * coins) time,
// O(amount) space. Returns -1 when the amount cannot be made.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const coin of coins) {
      if (coin <= x && dp[x - coin] + 1 < dp[x]) {
        dp[x] = dp[x - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Demo
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
console.log('knapsack        capacity 7 ->', knapsack(weights, values, 7));

console.log('lcs "ABCBDAB" "BDCABA" ->', longestCommonSubsequence('ABCBDAB', 'BDCABA'));

console.log('editDistance "kitten" "sitting" ->', editDistance('kitten', 'sitting'));

console.log('coinChange [1,2,5] 11 ->', coinChange([1, 2, 5], 11));
console.log('coinChange [2] 3      ->', coinChange([2], 3));

module.exports = { knapsack, longestCommonSubsequence, editDistance, coinChange };
