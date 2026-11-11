# List.sort

Java command · Sorting

Sorts the list in place with an external order. The sort is stable, so equal elements keep their input order.

## Syntax

```java
list.sort(Comparator.comparing(Type::key))
```

## Example

```java
List<Booking> bookings = new ArrayList<>(rows);

// City ascending, then revenue descending, then hotel name.
bookings.sort(Comparator
        .comparing(Booking::city)
        .thenComparing(Comparator.comparingInt(Booking::total).reversed())
        .thenComparing(Booking::hotelName));

bookings.forEach(b -> System.out.println(b.hotelName()));
```

## Details

`list.sort(null)` uses the natural order from `Comparable`. Put `reversed()` at the end when the whole chain should flip; put it on one key's comparator when only that key should.
