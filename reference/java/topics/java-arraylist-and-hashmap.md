# ArrayList and HashMap

Java topic · Exam Wiki

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

List<String> names = new ArrayList<>();
names.add("Anna");
names.add("Ben");
names.set(0, "Cara");
names.remove("Ben");
System.out.println(names.size());             // 1
System.out.println(names.get(0));             // Cara
System.out.println(names.contains("Cara"));   // true

Map<String, Integer> nights = new HashMap<>();
nights.put("Anna", 3);
nights.put("Ben", 5);
nights.put("Anna", 4);                        // overwrites
System.out.println(nights.get("Anna"));        // 4
System.out.println(nights.getOrDefault("Cara", 0)); // 0
System.out.println(nights.containsKey("Ben")); // true

for (Map.Entry<String, Integer> entry : nights.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

`ArrayList` keeps insertion order and allows duplicates. `HashMap` maps a key to a value, has no order, and overwrites on a duplicate key. `get` returns `null` for a missing key, so use `getOrDefault` or `containsKey`.
