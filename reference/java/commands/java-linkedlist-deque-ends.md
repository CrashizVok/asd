# LinkedList ends

Java command · Lists

Adds and removes at both ends in constant time. Index access walks the chain, so get(i) inside a loop is quadratic.

## Syntax

```java
list.addFirst(v); list.addLast(v); list.removeFirst();
```

## Example

```java
LinkedList<Booking> line = new LinkedList<>();
line.addLast(new Booking("Anna", 3));
line.addLast(new Booking("Bela", 1));

Booking next = line.removeFirst();   // Anna, constant time
Booking last = line.removeLast();    // Bela
System.out.println(line.size());     // 0
```

## Details

New code should prefer `ArrayDeque` for queue and stack work: one array, no node objects, and `null` is rejected so an empty poll is unambiguous. Keep `LinkedList` when you insert in the middle through a `ListIterator`.
