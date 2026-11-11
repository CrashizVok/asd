# removeIf

Java command · Lists

Removes every element that matches the predicate in one pass. Safe where a for-each loop with a remove call would throw ConcurrentModificationException.

## Syntax

```java
list.removeIf(element -> condition)
```

## Example

```java
List<Booking> bookings = new ArrayList<>(List.of(
        new Booking("Anna", 3),
        new Booking("Bela", 0),
        new Booking("Csilla", 2)));

// Drop invalid rows before the report runs.
bookings.removeIf(b -> b.nights() == 0);
System.out.println(bookings.size());   // 2
```
