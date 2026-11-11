# TreeMap sorted keys

Java command · Collections

A map that keeps its keys sorted. firstKey, lastKey, and headMap come from that order and HashMap cannot offer them.

## Syntax

```java
new TreeMap<>()
```

## Example

```java
// File: SortedScores.java
import java.util.Map;
import java.util.TreeMap;

public class SortedScores {
    public static void main(String[] args) {
        Map<String, Integer> scores = new TreeMap<>();
        scores.put("csilla", 88);
        scores.put("anna", 95);
        scores.put("bela", 71);

        // Iteration follows the natural order of the keys
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        System.out.println(scores.firstKey()); // anna
        System.out.println(scores.lastKey());  // csilla

        // headMap is exclusive of the bound, subMap is half open
        System.out.println(scores.headMap("csilla")); // {anna=95, bela=71}
    }
}
```
