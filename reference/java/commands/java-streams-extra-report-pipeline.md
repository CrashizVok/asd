# Group, sort entries, join

Java command · Streams

Builds a text report: group the rows, sort the entries by value, format each line, and join them into one string.

## Syntax

```java
collect(groupingBy(key, summingInt(f))).entrySet()
```

## Example

```java
// File: MiniReport.java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MiniReport {

    record Booking(String city, String hotel, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", "Danube View", 240),
                new Booking("Praha", "City Inn", 120),
                new Booking("Budapest", "City Inn", 80));

        // Data shape: Map<String, Integer> first, then sorted entries, then one String.
        // Group, sort the entries by value, format each line, join them.
        String report = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        Collectors.summingInt(Booking::total)))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(e -> e.getKey() + ": " + e.getValue())
                .collect(Collectors.joining("\n"));

        System.out.println(report);
    }
}
```

## Details

A map cannot be sorted directly, so the second half streams its `entrySet`. `Map.Entry.comparingByValue()` needs the type argument when the compiler cannot infer it, hence `Map.Entry.<String, Integer>comparingByValue().reversed()`.

Sorting by value descending and then joining with `\n` is the shortest path from a grouped map to a printed report. Add `.thenComparing(Map.Entry.comparingByKey())` to break ties in a fixed order.
