# sum, average, summaryStatistics

Java command · Collectors

Reduces a numeric field to one number. A primitive stream unlocks sum, average, min, max, and all five statistics in one pass.

## Syntax

```java
stream().mapToInt(f).sum()
```

## Example

```java
// File: SumAndAverage.java
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class SumAndAverage {

    record Booking(String city, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", 276),
                new Booking("Praha", 144),
                new Booking("Budapest", 60));

        // Data shape: List<Booking> -> int, then double.
        // mapToInt avoids boxing and unlocks sum, average, and summaryStatistics.
        int sum = bookings.stream().mapToInt(Booking::total).sum();                 // 0 on empty
        double average = bookings.stream().mapToInt(Booking::total).average().orElse(0); // OptionalDouble

        IntSummaryStatistics stats = bookings.stream()
                .mapToInt(Booking::total)
                .summaryStatistics();   // count, sum, min, max, average in one pass

        System.out.printf("sum=%d average=%.1f count=%d max=%d%n",
                sum, average, stats.getCount(), stats.getMax());

        // Inside collect, the same numbers grouped by a key.
        Map<String, Double> avgByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        Collectors.averagingInt(Booking::total)));
        System.out.println(avgByCity);
    }
}
```

## Details

`sum()` returns `0` for an empty stream while `average()` returns an empty `OptionalDouble`, so the two need different empty handling. `summaryStatistics()` computes count, sum, min, max, and average in one traversal.

The grouped forms take the field directly, for example `Collectors.summingInt(Booking::total)` or `Collectors.averagingInt(Booking::nights)`.
