# HashSet add and contains

Java command · Collections

Stores unique values with no order. add returns false when the value was already present, which makes it a duplicate check.

## Syntax

```java
new HashSet<>()
```

## Example

```java
// File: UniqueCities.java
import java.util.HashSet;
import java.util.Set;

public class UniqueCities {
    public static void main(String[] args) {
        Set<String> cities = new HashSet<>();

        System.out.println(cities.add("Budapest")); // true
        System.out.println(cities.add("Eger"));     // true
        System.out.println(cities.add("Budapest")); // false, already there

        System.out.println(cities.size());           // 2
        System.out.println(cities.contains("Eger")); // true

        // Iteration order of a HashSet is not the insertion order
        for (String city : cities) {
            System.out.println(city);
        }
    }
}
```
