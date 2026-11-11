# filter, map, collect

Java command · Streams

The three step pipeline: keep some rows, transform each row, store the result. Intermediate steps are lazy until the terminal call runs.

## Syntax

```java
stream.filter(p).map(f).collect(Collectors.toList())
```

## Example

```java
List<String> labels = bookings.stream()
        .filter(b -> b.nights() >= 2)          // keep longer stays
        .map(b -> b.hotelName() + " " + b.nights())
        .collect(Collectors.toList());

System.out.println(labels);
```

## Details

`toList()` returns an unmodifiable list, while `collect(Collectors.toList())` returns a mutable one in current JDKs. The source list is never changed by the pipeline.
