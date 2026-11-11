# ArrayList removeIf

Java command · Collections

Removes every element that matches the predicate in one pass. It is safer than removing inside a for each loop.

## Syntax

```java
list.removeIf(item -> condition)
```

## Example

```java
// File: Cleanup.java
import java.util.ArrayList;
import java.util.List;

public class Cleanup {
    public static void main(String[] args) {
        List<String> emails = new ArrayList<>(List.of(
            "anna@example.com",
            "bela@test.org",
            "csilla@example.com"
        ));

        // The predicate decides what leaves the list
        emails.removeIf(email -> email.endsWith("@example.com"));
        System.out.println(emails); // [bela@test.org]

        // Removing inside a for each loop throws ConcurrentModificationException,
        // removeIf exists to avoid that trap
    }
}
```
