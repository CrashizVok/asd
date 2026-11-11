# mapToInt and sum

Java command · Streams

Converts to a primitive stream, then totals it without boxing. Also unlocks average, min, max, and summaryStatistics.

## Syntax

```java
stream.mapToInt(Type::number).sum()
```

## Example

```java
int revenue = bookings.stream()
        .mapToInt(Booking::total)
        .sum();

double avgNights = bookings.stream()
        .mapToInt(Booking::nights)
        .average()
        .orElse(0);

System.out.println(revenue + " / " + avgNights);
```

## Details

`sum()` returns 0 for an empty stream. `average()` returns `OptionalDouble`, because an empty stream has no average.
