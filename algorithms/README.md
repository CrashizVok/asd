# Algorithm demos

Short, runnable demos in JavaScript and Java. Every file has a `main` or a set of `console.log` calls, so you can run it and watch the output. The comments explain the idea, the complexity, and the edge case that usually breaks it.

## Run the JavaScript files

```bash
node algorithms/javascript/sorting.js
node algorithms/javascript/searching.js
node algorithms/javascript/recursion.js
node algorithms/javascript/structures.js
node algorithms/javascript/graphs.js
node algorithms/javascript/dp.js
node algorithms/javascript/strings.js
node algorithms/javascript/math.js
```

Each file also exports its functions, so you can import one in a scratch file:

```js
const { mergeSort } = require('./algorithms/javascript/sorting.js');
console.log(mergeSort([3, 1, 2]));
```

The repository uses CommonJS in `algorithms/javascript` because these files run directly under Node. The React app uses ESM. Do not mix the two in one folder without a reason.

## Run the Java files

```bash
cd algorithms/java
javac Sorting.java
java Sorting
```

Replace `Sorting` with any of the other class names. Each file is self contained and has a `main` method.

## What is inside

| Topic | JavaScript | Java | What it shows |
|---|---|---|---|
| Sorting | `sorting.js` | `Sorting.java` | Bubble, selection, insertion, merge, quick |
| Searching | `searching.js` | `Searching.java` | Linear, binary iterative, binary recursive, lower bound |
| Recursion | `recursion.js` | `Recursion.java` | Factorial, Fibonacci, Hanoi, digit sum, reverse |
| Structures | `structures.js` | `Structures.java` | Stack, queue, linked list, binary search tree |
| Graphs | `graphs.js` | `Graphs.java` | BFS, DFS, Dijkstra, topological sort |
| Dynamic programming | `dp.js` | `Dp.java` | Knapsack, LCS, edit distance, coin change |
| Strings | `strings.js` | `Strings.java` | Palindrome, anagram, frequency, prefix, Caesar |
| Math | `math.js` | `MathTasks.java` | GCD, LCM, sieve, fast power, prime, Fibonacci |

## Complexity at a glance

| Algorithm | Time | Space | Note |
|---|---|---|---|
| Bubble sort | O(n^2) | O(1) | Best case O(n) with the swapped flag |
| Selection sort | O(n^2) | O(1) | Always the same number of comparisons |
| Insertion sort | O(n^2) | O(1) | Fast on nearly sorted data |
| Merge sort | O(n log n) | O(n) | Stable, needs a buffer |
| Quick sort | O(n log n) average | O(log n) | O(n^2) worst case on bad pivots |
| Linear search | O(n) | O(1) | Works on unsorted data |
| Binary search | O(log n) | O(1) iterative | The array must be sorted |
| BFS | O(V + E) | O(V) | Shortest path in an unweighted graph |
| DFS | O(V + E) | O(V) | Recursion depth can overflow |
| Dijkstra | O((V + E) log V) | O(V) | No negative edge weights |
| 0/1 knapsack | O(n * capacity) | O(capacity) | Capacity must be a reasonable integer |
| LCS | O(n * m) | O(n * m) | Two strings |
| Edit distance | O(n * m) | O(n * m) | Insert, delete, replace |
| Coin change | O(amount * coins) | O(amount) | Unlimited coins uses a forward loop |

## Study order

1. Sorting and searching. These appear in almost every exam.
2. Recursion. Write factorial and Fibonacci by hand until the base case is automatic.
3. Structures. Know when a stack, a queue, or a map is the right tool.
4. Strings and math. These are the easiest points in a timed task.
5. Graphs and DP. Learn the pattern, not every variation.

## Exam use

The exam rarely asks for a proof. It asks for a working function and a correct result. Copy the closest function, rename the variables, and run the sample. If the input is small, a simple O(n^2) loop is fine. Do not spend ten minutes optimizing a list of twenty rows.
