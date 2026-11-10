# TreeMap

Java command · Collections

A map sorted by key. Useful when output must be alphabetical or numeric order.

## Syntax

```java
new TreeMap<String, Integer>()
```

## Example

```java
import java.util.TreeMap;

TreeMap<String, Integer> counts = new TreeMap<>();
counts.put("Cara", 1);
counts.put("Anna", 2);

for (var entry : counts.entrySet()) {
    System.out.println(entry.getKey()); // Anna, Cara
}
```
