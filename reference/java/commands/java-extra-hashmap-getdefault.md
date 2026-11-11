# HashMap getOrDefault

Java command · Collections

Returns the mapped value or the fallback when the key is absent. It removes the null check after get.

## Syntax

```java
map.getOrDefault(key, fallback)
```

## Example

```java
// File: Stock.java
import java.util.HashMap;
import java.util.Map;

public class Stock {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("single", 4);
        stock.put("double", 0);

        // get() would return null for a missing key and unboxing would throw
        int singles = stock.getOrDefault("single", 0);
        int suites = stock.getOrDefault("suite", 0);
        System.out.println(singles); // 4
        System.out.println(suites);  // 0

        // A stored zero is returned as zero, not as the fallback
        System.out.println(stock.getOrDefault("double", 99)); // 0
    }
}
```
