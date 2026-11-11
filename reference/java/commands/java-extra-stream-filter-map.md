# Stream filter and map

Java command · Streams

Builds a pipeline: filter keeps matching items, map transforms them, and toList collects the result.

## Syntax

```java
list.stream().filter(predicate).map(function).toList()
```

## Example

```java
// File: HotelStream.java
import java.util.List;

public class HotelStream {
    record Hotel(String name, int stars) {}

    public static void main(String[] args) {
        List<Hotel> hotels = List.of(
            new Hotel("Danube View", 4),
            new Hotel("City Loft", 5),
            new Hotel("Lake Garden", 3)
        );

        // The stream does not change the source list
        List<String> topNames = hotels.stream()
            .filter(hotel -> hotel.stars() >= 4)
            .map(Hotel::name)
            .toList();

        System.out.println(topNames); // [Danube View, City Loft]

        // count() and anyMatch short circuit work on the same pipeline
        long top = hotels.stream().filter(hotel -> hotel.stars() == 5).count();
        System.out.println(top); // 1
    }
}
```
