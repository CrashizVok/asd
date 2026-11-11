# Files.walk()

Java command · Directories

Returns a Stream of paths under a directory, to a chosen depth. The stream holds a directory handle and must be closed.

## Syntax

```java
try (Stream<Path> paths = Files.walk(root)) { ... }
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ListTextFiles {
    public static void main(String[] args) throws IOException {
        Path root = Path.of("data");
        Files.createDirectories(root.resolve("2026"));
        Files.writeString(root.resolve("notes.txt"), "a\n");
        Files.writeString(root.resolve("2026").resolve("jan.txt"), "b\n");

        List<Path> files;
        // Depth 1 means the direct children of root.
        try (Stream<Path> paths = Files.walk(root, 1)) {
            files = paths.filter(Files::isRegularFile)
                         .sorted()
                         .collect(Collectors.toList());
        }

        for (Path file : files) {
            System.out.println(root.relativize(file) + " " + Files.size(file));
        }
    }
}
```

## Details

The two argument form takes a maximum depth: 0 is the root alone, 1 adds its children. The walk does not follow symbolic links unless you pass `FileVisitOption.FOLLOW_LINKS`, which is what stops a link loop from running forever. `sorted()` pulls every path into memory before it emits one, so it belongs on a tree you expect to fit. Collect inside the `try` and work with the list after it; a lazily consumed stream that escapes its block is a file handle leak.
