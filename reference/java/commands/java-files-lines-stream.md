# Files.lines()

Java command · Reading

Reads a file lazily as a Stream of lines. The stream holds an open file and must be closed.

## Syntax

```java
try (Stream<String> lines = Files.lines(path)) { ... }
```

## Example

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

public class CountErrors {
    public static void main(String[] args) throws IOException {
        try (Stream<String> lines = Files.lines(Path.of("app.log"), StandardCharsets.UTF_8)) {
            long errors = lines.filter(line -> line.contains("ERROR")).count();
            System.out.println("errors: " + errors);
        }
    }
}
```
