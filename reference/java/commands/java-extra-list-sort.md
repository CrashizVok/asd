# List.sort

Java command · Collections

Sorts the list in place. It works on any List, including ArrayList, and replaces Collections.sort for lists.

## Syntax

```java
list.sort(comparator)
```

## Example

```java
// File: SortCities.java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class SortCities {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>(List.of("Eger", "Budapest", "Gyor"));

        // Natural order uses compareTo of String
        cities.sort(Comparator.naturalOrder());
        System.out.println(cities); // [Budapest, Eger, Gyor]

        // Reversed order needs the explicit comparator
        cities.sort(Comparator.reverseOrder());
        System.out.println(cities); // [Gyor, Eger, Budapest]

        // Unmodifiable lists from List.of cannot be sorted, copy them first
    }
}
```
