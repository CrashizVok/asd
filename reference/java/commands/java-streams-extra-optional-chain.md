# Optional map, flatMap, orElse

Java command · Optional

Carries a value that may be missing through a chain of transformations and opens the box exactly once, at the end.

## Syntax

```java
optional.map(f).orElse(value)
```

## Example

```java
// File: OptionalChain.java
import java.util.List;
import java.util.Optional;

public class OptionalChain {

    record Booking(String city, int nights, String phone) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", 3, "+36 1 555 0100"),
                new Booking("Praha", 1, null));

        // Data shape: List<Booking> -> Optional<String>.
        // findFirst returns Optional. map keeps the empty case alive, so the
        // rest of the chain needs no null check.
        String city = bookings.stream()
                .filter(b -> b.nights() > 2)
                .map(Booking::city)
                .findFirst()
                .map(String::toUpperCase)
                .orElse("no long stay");
        System.out.println(city); // BUDAPEST

        // A nullable column becomes Optional with ofNullable, then disappears
        // from the stream with Optional::stream.
        Optional<String> phone = bookings.stream()
                .filter(b -> b.city().equals("Praha"))
                .findFirst()
                .flatMap(b -> Optional.ofNullable(b.phone()));
        System.out.println(phone.orElse("no phone on file"));
    }
}
```

## Details

`map` transforms a present value and leaves an empty box alone; `flatMap` is for a function that already returns `Optional`, such as a lookup or `Optional.ofNullable` on a nullable column.

`orElse` builds its argument every time, `orElseGet` only when the value is missing. `Optional.stream()` turns zero or one value into a stream, which lets `flatMap` drop the misses out of a longer pipeline.
