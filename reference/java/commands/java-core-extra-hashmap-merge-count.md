# HashMap.merge() for counting

Java command · Collections

Adds a value to a key, creating it when absent. It is the shortest counting idiom and removes the get, null check, put sequence.

## Syntax

```java
map.merge(key, 1, Integer::sum)
```

## Example

```java
// File: CountCities.java
import java.util.HashMap;
import java.util.Map;

public class CountCities {
    public static void main(String[] args) {
        String[] cities = {"Budapest", "Eger", "Budapest"};

        Map<String, Integer> counts = new HashMap<>();
        for (String city : cities) {
            // absent key starts at 1, a present key adds 1 to its value
            counts.merge(city, 1, Integer::sum);
        }
        System.out.println(counts.get("Budapest")); // 2

        // getOrDefault turns a missing key into a usable number
        System.out.println(counts.getOrDefault("Szeged", 0)); // 0

        // entrySet is the loop when keys and values are both needed
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }
}
```

## Details

The third argument is a `BiFunction` that receives the old value and the new one. `Integer::sum` is the common case. For a map of lists, `computeIfAbsent(key, k -> new ArrayList<>()).add(value)` is the matching idiom.

A map has no iteration order. Print a report by sorting the entries into a list, not by trusting `entrySet`.
