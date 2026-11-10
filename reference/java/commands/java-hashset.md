# HashSet

Java command · Collections

A set of unique values with fast contains. It does not keep order.

## Syntax

```java
new HashSet<String>()
```

## Example

```java
import java.util.HashSet;

HashSet<String> guests = new HashSet<>();
guests.add("Anna");
guests.add("Anna");
guests.add("Ben");

System.out.println(guests.size()); // 2
System.out.println(guests.contains("Ben")); // true
```
