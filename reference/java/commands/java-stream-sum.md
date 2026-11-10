# mapToInt and sum

Java command · Streams

Converts objects to a primitive stream and calculates sum, average, min, or max.

## Syntax

```java
list.stream().mapToInt(x -> x).sum()
```

## Example

```java
import java.util.*;

List<Integer> nights = List.of(2, 3, 5);
int total = nights.stream().mapToInt(Integer::intValue).sum();
double avg = nights.stream().mapToInt(Integer::intValue).average().orElse(0);

System.out.println(total); // 10
System.out.println(avg);   // 3.333...
```
