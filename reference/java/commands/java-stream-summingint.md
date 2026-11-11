# summingInt

Java command · Collectors

Adds a numeric field per group, so one pass produces a map of totals.

## Syntax

```java
collect(groupingBy(Type::key, summingInt(Type::number)))
```

## Example

```java
Map<String, Integer> revenueByCity = bookings.stream()
        .collect(Collectors.groupingBy(
                Booking::city,
                TreeMap::new,
                Collectors.summingInt(Booking::total)));

revenueByCity.forEach((city, total) ->
        System.out.printf("%-9s %6d%n", city, total));
```

## Details

Related downstreams: `summingLong`, `summingDouble`, `averagingInt`, and `summarizingInt`. Use them after grouping; `mapToInt` is no longer reachable at that point.
