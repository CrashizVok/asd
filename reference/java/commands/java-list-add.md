# ArrayList add, get, size

Java command · Lists

Appends an element, reads one back by index, and returns the element count. Index access is constant time on the backing array.

## Syntax

```java
list.add(value); list.get(index); list.size()
```

## Example

```java
List<Booking> bookings = new ArrayList<>();
bookings.add(new Booking("anna@example.com", "Budapest", 3));
bookings.add(new Booking("bela@example.com", "Vienna", 1));

Booking first = bookings.get(0);   // constant time, no walk
int rows = bookings.size();        // 2
```

## Details

Inserting or removing in the middle shifts the later elements, so that costs time proportional to the list size. `List.of(...)` returns an immutable list; wrap it in `new ArrayList<>(...)` before adding.
