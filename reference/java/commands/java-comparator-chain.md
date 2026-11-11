# Comparator.comparing

Java command · Sorting

Builds a multi key order outside the class. The first key decides, later keys break ties.

## Syntax

```java
Comparator.comparing(Type::key).thenComparing(Type::other)
```

## Example

```java
Comparator<Booking> report = Comparator
        .comparing(Booking::city)
        .thenComparing(Booking::hotelName)
        .thenComparingInt(Booking::nights);

bookings.sort(report);

// Whole chain reversed: nights descending first.
bookings.sort(Comparator.comparingInt(Booking::nights).reversed());
```

## Details

Use `comparingInt`, `comparingLong`, and `comparingDouble` for numbers to avoid boxing on each comparison. `nullsFirst` and `nullsLast` wrap a comparator for nullable fields. `Comparable` is the class's own order; a `Comparator` is an outside opinion and a class can have many.
