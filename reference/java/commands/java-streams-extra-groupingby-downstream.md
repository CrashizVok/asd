# groupingBy with a downstream

Java command · Collectors

Groups rows by a key and applies a collector to each group, so one pass can produce counts, sums, or sets instead of lists.

## Syntax

```java
collect(groupingBy(key, mapFactory, downstream))
```

## Example

```java
// File: GroupTotals.java
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class GroupTotals {

    record Booking(String city, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", 240),
                new Booking("Praha", 120),
                new Booking("Budapest", 80));

        // Data shape: Map<String, Integer>, city to revenue, keys sorted.
        Map<String, Integer> revenue = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,                        // sorted keys
                        Collectors.summingInt(Booking::total)));
        System.out.println(revenue); // {Budapest=320, Praha=120}

        // The two argument form drops the map factory: HashMap, order not promised.
        Map<String, Long> counts = bookings.stream()
                .collect(Collectors.groupingBy(Booking::city, Collectors.counting()));
        System.out.println(counts);
    }
}
```

## Details

The classifier builds the key, the downstream decides the value. A null key from the classifier throws `NullPointerException` before any collector runs, so filter those rows out or default the field.

Nesting works by passing another `groupingBy` as the downstream:

```java
Map<String, Map<String, Long>> perCity = bookings.stream()
        .collect(Collectors.groupingBy(Booking::city,
                Collectors.groupingBy(Booking::hotel, Collectors.counting())));
```
