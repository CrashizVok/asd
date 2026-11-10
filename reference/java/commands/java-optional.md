# Optional

Java command · Streams

Represents a value that may be missing. Use orElse, ifPresent, map, and orElseThrow instead of null checks.

## Syntax

```java
Optional.of(value)
Optional.empty()
```

## Example

```java
import java.util.*;

Optional<String> name = Optional.of("Anna");
System.out.println(name.orElse("Guest")); // Anna

Optional<String> empty = Optional.empty();
System.out.println(empty.orElse("Guest")); // Guest
```
