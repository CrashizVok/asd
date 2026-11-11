# flatMap()

Java command · Streams

Turns each element into a stream and joins those streams into one. Use it when a field holds a collection.

## Syntax

```java
list.stream().flatMap(e -> e.items().stream())
```

## Example

```java
// File: FlatMapDemo.java
import java.util.List;
import java.util.stream.Collectors;

public class FlatMapDemo {

    record Booking(String hotel, List<String> guests) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Danube View", List.of("Anna", "Peter")),
                new Booking("City Inn", List.of("Bela")));

        // Data shape: List<Booking> -> Stream<String> -> one String.
        // flatMap opens each inner list and joins the parts; map would leave
        // a Stream<List<String>> that none of the string operations accept.
        String all = bookings.stream()
                .flatMap(b -> b.guests().stream())
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));

        System.out.println(all); // Anna, Bela, Peter
    }
}
```

## Details

`map(b -> b.guests())` gives a `Stream<List<String>>`. `flatMap` gives a `Stream<String>`, which is what `distinct`, `sorted`, and `joining` need. Inside `groupingBy`, `Collectors.flatMapping` does the same job per group.

A row whose list is empty contributes nothing, so the result never contains a null element produced by an empty collection.
