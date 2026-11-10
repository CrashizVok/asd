# Collectors.groupingBy and counting

Java command · Streams

Groups stream items by a key and counts them. Useful for statistics by year, city, or hotel.

## Syntax

```java
collect(Collectors.groupingBy(x -> x.key, Collectors.counting()))
```

## Example

```java
import java.util.*;
import java.util.stream.*;

List<String> guests = List.of("Anna", "Ben", "Anna");
Map<String, Long> counts = guests.stream()
    .collect(Collectors.groupingBy(g -> g, Collectors.counting()));

System.out.println(counts); // {Anna=2, Ben=1}
```
