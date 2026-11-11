# max() and min()

Java command · Streams

Returns the largest or smallest element by a comparator, wrapped in Optional because the stream may be empty.

## Syntax

```java
stream().max(comparator)
```

## Example

```java
// File: Extremes.java
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class Extremes {

    record Booking(String hotel, int nights) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Danube View", 3),
                new Booking("Alpen Hof", 4),
                new Booking("City Inn", 1));

        // Data shape: Optional<Booking>. Empty when the list is empty.
        // comparingInt reads an int field without boxing it.
        Optional<Booking> longest = bookings.stream()
                .max(Comparator.comparingInt(Booking::nights));
        Optional<Booking> shortest = bookings.stream()
                .min(Comparator.comparingInt(Booking::nights));

        // map plus orElse prints without an isPresent check.
        System.out.println(longest.map(b -> b.hotel() + " " + b.nights()).orElse("none"));
        System.out.println(shortest.map(Booking::hotel).orElse("none"));

        // Descending order is a comparator change, not a second method.
        bookings.stream()
                .sorted(Comparator.comparingInt(Booking::nights).reversed())
                .limit(1)
                .forEach(b -> System.out.println("top: " + b.hotel()));
    }
}
```

## Details

Both terminals return `Optional<T>`, never a bare element, so the empty case is visible in the return type. `Comparator.comparingInt` reads an int field without boxing it.

For a top list, sort with `Comparator.comparingInt(Booking::nights).reversed()` and then `limit(n)`. `max` returns one element, not a ranking.
