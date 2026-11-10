'use strict';

// Adjacency list: an object where each key holds the list of its neighbours.
// Space O(V + E). Adding an edge is O(1).
function buildGraph(edges, directed = false) {
  const graph = {};
  const add = (a, b) => {
    if (!graph[a]) graph[a] = [];
    graph[a].push(b);
  };
  for (const [a, b] of edges) {
    add(a, b);
    if (!directed) add(b, a);
  }
  return graph;
}

// BFS: explore level by level with a queue.
// O(V + E) time, O(V) space. Gives shortest hop counts on unweighted graphs.
function bfs(graph, start) {
  const order = [];
  const seen = new Set([start]);
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const next of graph[node] || []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

// DFS: go as deep as possible before backtracking. Recursive here.
// O(V + E) time, O(V) space including the call stack.
function dfs(graph, start, seen = new Set(), order = []) {
  if (seen.has(start)) return order;
  seen.add(start);
  order.push(start);
  for (const next of graph[start] || []) dfs(graph, next, seen, order);
  return order;
}

// Binary heap as a min priority queue: push and pop are O(log n), peek is O(1).
class MinHeap {
  constructor() {
    this.items = [];
  }
  push(value, priority) {
    this.items.push({ value, priority });
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[parent].priority <= this.items[i].priority) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }
  pop() {
    if (this.items.length === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let small = i;
        if (l < n && this.items[l].priority < this.items[small].priority) small = l;
        if (r < n && this.items[r].priority < this.items[small].priority) small = r;
        if (small === i) break;
        [this.items[i], this.items[small]] = [this.items[small], this.items[i]];
        i = small;
      }
    }
    return top;
  }
  get size() {
    return this.items.length;
  }
}

// Dijkstra: shortest paths from start on a graph of non-negative weights.
// Edges are given as { to, weight } objects. O((V + E) log V) with a binary heap.
function dijkstra(graph, start) {
  const dist = {};
  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[start] = 0;
  const heap = new MinHeap();
  heap.push(start, 0);
  const done = new Set();
  while (heap.size > 0) {
    const { value: node, priority: d } = heap.pop();
    if (done.has(node)) continue; // stale entry
    done.add(node);
    for (const edge of graph[node] || []) {
      const next = d + edge.weight;
      if (next < dist[edge.to]) {
        dist[edge.to] = next;
        heap.push(edge.to, next);
      }
    }
  }
  return dist;
}

// Topological sort (Kahn): repeatedly take a node with no incoming edges.
// O(V + E) time. Returns null when the graph has a cycle.
function topologicalSort(graph) {
  const indegree = {};
  for (const node of Object.keys(graph)) indegree[node] = indegree[node] || 0;
  for (const node of Object.keys(graph)) {
    for (const next of graph[node]) indegree[next] = (indegree[next] || 0) + 1;
  }
  const queue = Object.keys(indegree).filter((n) => indegree[n] === 0);
  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const next of graph[node] || []) {
      indegree[next]--;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === Object.keys(indegree).length ? order : null;
}

// Demo
const undirected = buildGraph([['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'], ['d', 'e']]);
console.log('graph          ', JSON.stringify(undirected));
console.log('bfs from a     ', bfs(undirected, 'a').join(' -> '));
console.log('dfs from a     ', dfs(undirected, 'a').join(' -> '));

const weighted = {
  A: [{ to: 'B', weight: 4 }, { to: 'C', weight: 1 }],
  B: [{ to: 'D', weight: 1 }],
  C: [{ to: 'B', weight: 2 }, { to: 'D', weight: 5 }],
  D: [{ to: 'E', weight: 3 }],
  E: [],
};
console.log('dijkstra from A', dijkstra(weighted, 'A'));

const dag = { A: ['B', 'C'], B: ['D'], C: ['D'], D: ['E'], E: [] };
console.log('topological    ', topologicalSort(dag));
console.log('cycle graph    ', topologicalSort({ X: ['Y'], Y: ['X'] }));

module.exports = { buildGraph, bfs, dfs, MinHeap, dijkstra, topologicalSort };
