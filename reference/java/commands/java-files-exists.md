# Files.exists()

Java command · Paths

Reports whether a path exists. Use it before reading an optional input, not as proof that a later write will succeed.

## Syntax

```java
Files.exists(path)
```

## Example

```java
import java.nio.file.Files;
import java.nio.file.Path;

Path input = Path.of("bookings.csv");

if (!Files.exists(input)) {
    System.out.println("Missing input: " + input.toAbsolutePath());
    return;
}

System.out.println("size: " + Files.size(input));
```

## Details

`Files.notExists` is not always the negation: when access is denied, both can return false. For a required input, `Files.exists` followed by a read is the useful pair.
