# stream

Java command · Streams

Processes a collection with a chain of operations. Streams do not change the source unless you collect or forEach.

## Syntax

```java
list.stream().filter(...).map(...).toList()
```

## Example

```java
import java.util.*;

List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
List<Integer> even = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 10)
    .toList();

System.out.println(even); // [20, 40, 60]
```
