# Arrays

JavaScript topic · Exam Wiki

```js
const nums = [3, 1, 4, 1, 5];
nums.length;        // 5
nums.push(9);       // add to end
nums.pop();         // remove from end
nums.slice(1, 3);   // copy, no mutation
nums.splice(1, 2);  // removes items, mutates
nums.includes(4);   // true
nums.join(", ");    // "3, 1, 4, 1, 5"
```
`push` and `pop` change the array. `slice` copies. `splice` edits in place and returns the removed items.
