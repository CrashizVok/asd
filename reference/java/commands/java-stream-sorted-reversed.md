# sorted with a comparator

Java command · Streams

Sorts the stream for the rest of the pipeline. A custom comparator is needed whenever the element is not Comparable or the order is not natural.

## Syntax

```java
stream.sorted(Comparator.comparingInt(Type::number).reversed())
```

## Example

```java
List<String> top = bookings.stream()
        .sorted(Comparator.comparingInt(Booking::total).reversed())
        .limit(3)
        .map(b -> b.hotelName() + " (" + b.total() + ")")
        .toList();

System.out.println(top);
```
