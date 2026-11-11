# sorted, distinct, limit

Java command · Sorting

Orders the stream, removes duplicates by equals, and cuts it short. The position of each step changes the result.

## Syntax

```java
stream().sorted(comparator).distinct().limit(n)
```

## Example

```java
// File: TopThree.java
import java.util.Comparator;
import java.util.List;

public class TopThree {

    record Booking(String hotel, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Danube View", 240),
                new Booking("City Inn", 120),
                new Booking("Danube View", 400),
                new Booking("Alpen Hof", 380),
                new Booking("City Inn", 60));

        // Data shape: List<Booking> -> List<String>, order and length decided here.
        // distinct then limit: three different hotels.
        List<String> hotels = bookings.stream()
                .map(Booking::hotel)
                .distinct()
                .sorted()
                .limit(2)
                .toList();
        System.out.println(hotels); // [Alpen Hof, City Inn]

        // limit then distinct can return fewer rows than asked for, because
        // the duplicates were already inside the cut. Order matters.
        long fewer = bookings.stream()
                .map(Booking::hotel)
                .limit(3)
                .distinct()
                .count();
        System.out.println(fewer); // 2, not 3: the third hotel was a repeat

        // Top 3 by value: sort descending first, then cut.
        List<String> top = bookings.stream()
                .sorted(Comparator.comparingInt(Booking::total).reversed())
                .limit(3)
                .map(b -> b.hotel() + "=" + b.total())
                .toList();
        System.out.println(top);
    }
}
```

## Details

`distinct` uses `equals` and `hashCode`, so it only removes duplicates that the class actually defines. `sorted()` with no argument needs a `Comparable` element type and throws `ClassCastException` otherwise.

`limit` cuts at its own position in the chain. `distinct` before `limit` fills the count with different values, `limit` before `distinct` can return fewer rows than asked for.
