'use strict';

// Palindrome: reads the same forwards and backwards, ignoring case and
// non-letter characters. Two pointers, O(n) time, O(1) extra space.
function isPalindrome(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let lo = 0;
  let hi = clean.length - 1;
  while (lo < hi) {
    if (clean[lo] !== clean[hi]) return false;
    lo++;
    hi--;
  }
  return true;
}

// Anagram: same letters, same counts. Counting map, O(n) time, O(k) space.
function isAnagram(a, b) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const x = normalize(a);
  const y = normalize(b);
  if (x.length !== y.length) return false;
  const counts = new Map();
  for (const ch of x) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (const ch of y) {
    const left = counts.get(ch);
    if (!left) return false;
    if (left === 1) counts.delete(ch);
    else counts.set(ch, left - 1);
  }
  return counts.size === 0;
}

// Character frequency: how often each character appears. O(n) time.
function characterFrequency(text) {
  const counts = {};
  for (const ch of text) counts[ch] = (counts[ch] || 0) + 1;
  return counts;
}

// Word frequency: split on whitespace and punctuation, then count. O(n) time.
function wordFrequency(text) {
  const counts = {};
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  for (const word of words) counts[word] = (counts[word] || 0) + 1;
  return counts;
}

// Longest common prefix: compare characters column by column across all words.
// O(total characters) time, O(1) extra space beyond the result.
function longestCommonPrefix(words) {
  if (words.length === 0) return '';
  const first = words[0];
  for (let i = 0; i < first.length; i++) {
    for (let w = 1; w < words.length; w++) {
      if (words[w][i] !== first[i]) return first.slice(0, i);
    }
  }
  return first;
}

// Caesar cipher: shift each letter by k, wrapping around the alphabet
// and keeping the original case. O(n) time.
function caesarCipher(text, shift) {
  const k = ((shift % 26) + 26) % 26; // works for negative shifts too
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + k) % 26) + base);
  });
}

// Demo
console.log('isPalindrome "A man, a plan, a canal: Panama" ->', isPalindrome('A man, a plan, a canal: Panama'));
console.log('isPalindrome "hello"                       ->', isPalindrome('hello'));
console.log('isAnagram "listen" "silent"                ->', isAnagram('listen', 'silent'));
console.log('isAnagram "abc" "abd"                      ->', isAnagram('abc', 'abd'));
console.log('characterFrequency "banana"                ->', characterFrequency('banana'));
console.log('wordFrequency "the cat the dog"            ->', wordFrequency('the cat the dog'));
console.log('longestCommonPrefix                        ->', longestCommonPrefix(['flower', 'flow', 'flight']));
const secret = caesarCipher('Hello, World!', 3);
console.log('caesar +3 "Hello, World!"                  ->', secret);
console.log('caesar -3 back                             ->', caesarCipher(secret, -3));

module.exports = {
  isPalindrome,
  isAnagram,
  characterFrequency,
  wordFrequency,
  longestCommonPrefix,
  caesarCipher,
};
