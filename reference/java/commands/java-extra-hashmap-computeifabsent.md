# HashMap computeIfAbsent

Java command · Collections

Creates and stores a value only when the key is missing, then returns it. It removes the get, null check, put sequence.

## Syntax

```java
map.computeIfAbsent(key, key -> new Value())
```

## Example

```java
// File: GroupByCity.java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GroupByCity {
    public static void main(String[] args) {
        Map<String, List<String>> byCity = new HashMap<>();

        // The lambda runs only on the first hotel for each city
        byCity.computeIfAbsent("Budapest", key -> new ArrayList<>()).add("Danube View");
        byCity.computeIfAbsent("Eger", key -> new ArrayList<>()).add("Valley Inn");
        byCity.computeIfAbsent("Budapest", key -> new ArrayList<>()).add("City Loft");

        System.out.println(byCity.get("Budapest")); // [Danube View, City Loft]
        System.out.println(byCity.get("Eger"));     // [Valley Inn]
    }
}
```
