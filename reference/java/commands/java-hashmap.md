# HashMap

Java command · Collections

Stores key/value pairs with fast lookup. Keys are unique. put replaces an existing value.

## Syntax

```java
new HashMap<String, Integer>()
```

## Example

```java
import java.util.HashMap;

HashMap<String, Integer> counts = new HashMap<>();
counts.put("Anna", 2);
counts.put("Ben", 1);
counts.put("Anna", counts.get("Anna") + 1);

System.out.println(counts.get("Anna")); // 3
System.out.println(counts.containsKey("Cara")); // false
for (var entry : counts.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```
