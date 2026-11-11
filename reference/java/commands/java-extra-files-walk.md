# Files.walk

Java command · File IO

Streams every path below a directory. The stream holds an open directory handle, so close it with try with resources.

## Syntax

```java
Files.walk(Path.of("dir"))
```

## Example

```java
// File: FindCsv.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class FindCsv {
    public static void main(String[] args) throws IOException {
        Path root = Path.of("data");

        try (Stream<Path> paths = Files.walk(root)) {
            List<Path> csvFiles = paths
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".csv"))
                .toList();

            csvFiles.forEach(System.out::println);
        }

        // Files.list is the shallow version, Files.find adds a depth filter
    }
}
```
