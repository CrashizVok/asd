# lambda expression

Java command · Streams

A short implementation of a functional interface. Use it with Comparator, Runnable, and stream operations.

## Syntax

```java
(a, b) -> a + b
```

## Example

```java
import java.util.*;

List<String> names = new ArrayList<>(List.of("Cara", "Anna"));
names.sort((a, b) -> a.compareTo(b));

Runnable task = () -> System.out.println("run");
task.run();
```
