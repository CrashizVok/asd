# Queue offer and poll

Java command · Queues

First in, first out. offer returns false when full, poll and peek return null when empty; add, remove, and element throw instead.

## Syntax

```java
queue.offer(e); queue.poll(); queue.peek()
```

## Example

```java
Queue<Booking> checkIn = new ArrayDeque<>();
checkIn.offer(new Booking("Anna", 3));
checkIn.offer(new Booking("Bela", 1));

Booking next = checkIn.poll();   // Anna, null when empty
Booking peeked = checkIn.peek(); // Bela, still queued
System.out.println(checkIn.size());   // 1
```
