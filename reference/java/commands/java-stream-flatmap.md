# flatMap

Java command · Streams

Turns each element into a stream and joins the results, which flattens a field that holds a list.

## Syntax

```java
stream.flatMap(e -> e.list().stream())
```

## Example

```java
// Each booking holds the names of every guest on the reservation.
String everyone = bookings.stream()
        .flatMap(b -> b.guests().stream())
        .distinct()
        .sorted()
        .collect(Collectors.joining(", "));

System.out.println(everyone);   // Anna, Bela, Csilla, Dora
```

## Details

`map` would give a stream of lists here. Inside `collect`, `Collectors.flatMapping` does the same job as a downstream collector.
