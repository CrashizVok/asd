# partitioningBy()

Java command · Collectors

Splits the stream into two groups on a boolean. The result always holds both keys, even when one side is empty.

## Syntax

```java
collect(partitioningBy(predicate, downstream))
```

## Example

```java
// File: SplitByBreakfast.java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class SplitByBreakfast {

    record Booking(boolean breakfast, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking(true, 276),
                new Booking(false, 380),
                new Booking(false, 60));

        // Data shape: Map<Boolean, Long>. Both keys exist even when a side is empty.
        Map<Boolean, Long> counts = bookings.stream()
                .collect(Collectors.partitioningBy(Booking::breakfast, Collectors.counting()));
        System.out.println(counts.get(true) + " with, " + counts.get(false) + " without");

        // averagingInt gives 0.0 for an empty side. No Optional, no missing key.
        Map<Boolean, Double> averages = bookings.stream()
                .collect(Collectors.partitioningBy(
                        Booking::breakfast,
                        Collectors.averagingInt(Booking::total)));
        System.out.println(averages); // {false=220.0, true=276.0}
    }
}
```

## Details

Both keys are always present, so `map.get(true)` never returns null. That is the difference from `groupingBy`, which drops a key that never occurs. The downstream forms (`counting`, `averagingInt`, `filtering`, `mapping`) avoid a second pass over the rows.
