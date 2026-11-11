# Iterator remove

Java command · Iteration

Removes the element returned by the last next() call. The only legal way to delete while walking a fail-fast collection.

## Syntax

```java
it.remove()
```

## Example

```java
Iterator<Booking> it = bookings.iterator();
while (it.hasNext()) {
    Booking b = it.next();
    if (b.nights() == 0) {
        it.remove();   // legal removal through the iterator
    }
}

// A for-each loop would throw ConcurrentModificationException here.
```

## Details

`removeIf` does the same job in one line. `ListIterator` adds `previous`, `set`, and `add` for editing during the walk.
