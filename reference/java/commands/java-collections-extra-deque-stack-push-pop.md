# Deque as a stack

Java command · Deques

push and pop act on the front of the deque, which gives LIFO behaviour without the legacy Stack class.

## Syntax

```java
deque.push(v); deque.pop(); deque.peek()
```

## Example

```java
Deque<String> undo = new ArrayDeque<>();
undo.push("drop row 4");
undo.push("edit row 2");

// The last push is the first pop.
System.out.println(undo.pop());     // edit row 2
System.out.println(undo.pop());     // drop row 4
System.out.println(undo.peek());    // null, the stack is empty
```

## Details

`pop` on an empty deque throws `NoSuchElementException`, while `peek` returns null. Check `isEmpty` when the stack can run dry.

`ArrayDeque` rejects null elements, so a null answer from `peek` can only mean empty. The front is also the queue head: `offerLast` and `pollFirst` make the same object a FIFO queue.
