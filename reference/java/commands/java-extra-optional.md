# Optional map and orElse

Java command · Core

Represents a value that may be missing. map transforms only when present, orElse supplies the fallback.

## Syntax

```java
Optional.ofNullable(value).map(fn).orElse(fallback)
```

## Example

```java
// File: FindHotel.java
import java.util.List;
import java.util.Optional;

public class FindHotel {
    record Hotel(String name, int stars) {}

    public static void main(String[] args) {
        List<Hotel> hotels = List.of(
            new Hotel("Danube View", 4),
            new Hotel("City Loft", 5)
        );

        Optional<Hotel> fiveStar = hotels.stream()
            .filter(hotel -> hotel.stars() == 5)
            .findFirst();

        // map runs only when a value is present
        String name = fiveStar.map(Hotel::name).orElse("no hotel");
        System.out.println(name); // City Loft

        // orElseThrow is the safer choice when the value is required
        Hotel hotel = fiveStar.orElseThrow(() -> new IllegalStateException("missing"));
        System.out.println(hotel.name());

        // Do not call get() without isPresent(), Optional exists to avoid that
    }
}
```
