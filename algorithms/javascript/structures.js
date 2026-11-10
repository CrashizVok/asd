'use strict';

// Stack: last in, first out. push and pop are O(1).
class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
    return this;
  }
  pop() {
    return this.items.pop();
  }
  get size() {
    return this.items.length;
  }
}
// Queue: first in, first out. Uses an index instead of shift so dequeue is O(1).
class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }
  enqueue(value) {
    this.items.push(value);
    return this;
  }
  dequeue() {
    if (this.head >= this.items.length) return undefined;
    return this.items[this.head++];
  }
  get size() {
    return this.items.length - this.head;
  }
}

// Singly linked list. Insert at head O(1), search and delete O(n).
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  prepend(value) {
    this.head = { value, next: this.head };
    this.length++;
    return this;
  }
  append(value) {
    const node = { value, next: null };
    this.length++;
    if (!this.head) {
      this.head = node;
      return this;
    }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
    return this;
  }
  contains(value) {
    let cur = this.head;
    while (cur) {
      if (cur.value === value) return true;
      cur = cur.next;
    }
    return false;
  }
  remove(value) {
    if (!this.head) return false;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return true;
    }
    let cur = this.head;
    while (cur.next && cur.next.value !== value) cur = cur.next;
    if (!cur.next) return false;
    cur.next = cur.next.next;
    this.length--;
    return true;
  }
  toArray() {
    const out = [];
    for (let cur = this.head; cur; cur = cur.next) out.push(cur.value);
    return out;
  }
}

// Binary search tree. Average O(log n) per operation, O(n) when it degenerates.
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    const node = { value, left: null, right: null };
    if (!this.root) {
      this.root = node;
      return this;
    }
    let cur = this.root;
    while (true) {
      if (value < cur.value) {
        if (!cur.left) { cur.left = node; return this; }
        cur = cur.left;
      } else if (value > cur.value) {
        if (!cur.right) { cur.right = node; return this; }
        cur = cur.right;
      } else {
        return this; // duplicates ignored
      }
    }
  }
  contains(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }
  // In-order walk of a BST visits values in ascending order.
  inOrder() {
    const out = [];
    const walk = (node) => {
      if (!node) return;
      walk(node.left);
      out.push(node.value);
      walk(node.right);
    };
    walk(this.root);
    return out;
  }
}

// Demo
const stack = new Stack();
stack.push(1).push(2).push(3);
console.log('stack pop order   ', stack.pop(), stack.pop(), stack.pop());

const queue = new Queue();
queue.enqueue('a').enqueue('b').enqueue('c');
console.log('queue dequeue     ', queue.dequeue(), queue.dequeue(), queue.dequeue());

const list = new LinkedList();
list.append(1).append(2).append(3).prepend(0);
console.log('list              ', list.toArray(), 'contains 2:', list.contains(2));
list.remove(2);
console.log('after remove 2    ', list.toArray());

const bst = new BinarySearchTree();
[8, 3, 10, 1, 6, 14, 4].forEach((v) => bst.insert(v));
console.log('bst in-order      ', bst.inOrder());
console.log('bst contains 6    ', bst.contains(6), 'contains 7:', bst.contains(7));

module.exports = { Stack, Queue, LinkedList, BinarySearchTree };
