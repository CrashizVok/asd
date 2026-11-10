# Lambda and streams

Java topic · Exam Wiki

```java
List<String> names = List.of("Anna", "Ben", "Cara");

names.forEach(name -> System.out.println(name));

List<String> shortNames = names.stream()
    .filter(name -> name.length() <= 3)
    .map(String::toUpperCase)
    .sorted()
    .toList();

long count = names.stream().filter(name -> name.startsWith("A")).count();
```

A lambda is a short implementation of a functional interface. A stream chains filter, map, sort, and collect without writing a loop. `toList()` returns an immutable list. Use a normal loop when you need an index or early exit.
