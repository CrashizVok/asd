# Files.list()

Java command · Paths

Lists the entries of one directory as a Stream<Path>. The stream holds a directory handle and must be closed.

## Syntax

```java
try (Stream<Path> files = Files.list(dir)) { ... }
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

public class ListCsv {
    public static void main(String[] args) throws IOException {
        try (Stream<Path> files = Files.list(Path.of("data"))) {
            files.filter(p -> p.toString().endsWith(".csv"))
                 .sorted()
                 .forEach(p -> System.out.println(p.getFileName()));
        }
    }
}
```

## Details

`Files.walk(dir)` goes into subdirectories and also returns a stream that must be closed. Do not use `File.list()` in new code; it returns null on failure instead of throwing a useful exception.
