# HashSet and TreeSet

Java topic · Exam Wiki

```java
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

Set<String> cities = new HashSet<>();
cities.add("Budapest");
cities.add("Debrecen");
cities.add("Budapest"); // ignored
System.out.println(cities.size());          // 2
System.out.println(cities.contains("Debrecen")); // true

Set<Integer> sorted = new TreeSet<>(List.of(3, 1, 2, 1));
System.out.println(sorted); // [1, 2, 3]
```

A `Set` stores unique values. `HashSet` is fast and unordered. `TreeSet` keeps natural order and is slower. Use a `Set` when duplicates are a bug.
