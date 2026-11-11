# Comparator.comparing

Java command · Collections

Builds a comparator from a key extractor. Chain thenComparing for a second key and reversed for descending order.

## Syntax

```java
Comparator.comparing(Type::getter).thenComparing(Type::getter)
```

## Example

```java
// File: HotelSort.java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class HotelSort {
    record Hotel(String name, int stars, String city) {}

    public static void main(String[] args) {
        List<Hotel> hotels = new ArrayList<>(List.of(
            new Hotel("Lake Garden", 3, "Eger"),
            new Hotel("City Loft", 5, "Budapest"),
            new Hotel("Danube View", 5, "Budapest")
        ));

        // Highest stars first, then name A to Z
        hotels.sort(
            Comparator.comparingInt(Hotel::stars)
                      .reversed()
                      .thenComparing(Hotel::name)
        );

        hotels.forEach(hotel -> System.out.println(hotel.name()));
        // City Loft, Danube View, Lake Garden
    }
}
```
