# Collectors.groupingBy

Java command · Streams

Collects items into a Map keyed by the classifier result. A second collector can count or sum within each group.

## Syntax

```java
stream.collect(Collectors.groupingBy(classifier))
```

## Example

```java
// File: GroupHotels.java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GroupHotels {
    record Hotel(String name, String city, int stars) {}

    public static void main(String[] args) {
        List<Hotel> hotels = List.of(
            new Hotel("Danube View", "Budapest", 4),
            new Hotel("City Loft", "Budapest", 5),
            new Hotel("Valley Inn", "Eger", 3)
        );

        Map<String, List<Hotel>> byCity = hotels.stream()
            .collect(Collectors.groupingBy(Hotel::city));
        System.out.println(byCity.get("Budapest").size()); // 2

        // Downstream collector counts instead of listing
        Map<String, Long> countByCity = hotels.stream()
            .collect(Collectors.groupingBy(Hotel::city, Collectors.counting()));
        System.out.println(countByCity); // {Budapest=2, Eger=1}
    }
}
```
