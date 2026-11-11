# ArrayDeque

Java command · Queues

Double ended queue for both FIFO lines and LIFO stacks. addFirst, addLast, pollFirst, pollLast, push, and pop cover both ends.

## Syntax

```java
Deque<E> d = new ArrayDeque<>()
```

## Example

```java
Deque<String> history = new ArrayDeque<>();
history.push("list");    // add to the front
history.push("map");
history.push("stream");

System.out.println(history.pop());     // stream
System.out.println(history.peek());    // map
System.out.println(history.size());    // 2
```

## Details

`ArrayDeque` rejects `null`, so a `null` from `poll` can only mean empty. It is faster than the legacy synchronized `Stack` for stack work.
