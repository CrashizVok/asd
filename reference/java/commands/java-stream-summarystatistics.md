# summaryStatistics

Java command · Streams

Computes count, sum, min, max, and average in one pass over the data.

## Syntax

```java
stream.mapToInt(Type::number).summaryStatistics()
```

## Example

```java
IntSummaryStatistics stats = bookings.stream()
        .mapToInt(Booking::nights)
        .summaryStatistics();

System.out.println(stats.getCount());
System.out.println(stats.getSum());
System.out.println(stats.getMin() + " - " + stats.getMax());
System.out.printf("%.2f%n", stats.getAverage());
```

## Details

The collector form is `Collectors.summarizingInt`. On an empty stream the count and sum are 0 and the average is `0.0`, so guard the division if the report divides by the count.
