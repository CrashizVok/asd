# List.of

Java command · Lists

Builds a fixed size, immutable list in one line. Useful for seed data and test fixtures.

## Syntax

```java
List.of(a, b, c)
```

## Example

```java
List<String> cities = List.of("Budapest", "Vienna", "Praha");
// cities.add("Rome");   // UnsupportedOperationException

// A mutable copy when the report needs to sort or edit it.
List<String> editable = new ArrayList<>(cities);
editable.add("Rome");
```
