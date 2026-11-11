# HashSet duplicate check

Java command · Collections

Stores unique values and reports a duplicate through the boolean result of add. No order is kept and null is allowed once.

## Syntax

```java
set.add(value) // false if present
```

## Example

```java
// File: UniqueEmails.java
import java.util.HashSet;
import java.util.Set;

public class UniqueEmails {
    public static void main(String[] args) {
        Set<String> seen = new HashSet<>();

        // add returns false when the value was already present
        System.out.println(seen.add("anna@example.com")); // true
        System.out.println(seen.add("bela@example.com")); // true
        System.out.println(seen.add("anna@example.com")); // false

        System.out.println(seen.size());                       // 2
        System.out.println(seen.contains("bela@example.com")); // true

        // iteration order is not insertion order
        for (String email : seen) {
            System.out.println(email);
        }
    }
}
```
