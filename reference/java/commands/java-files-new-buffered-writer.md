# Files.newBufferedWriter()

Java command · Writing

Opens a BufferedWriter with a chosen charset and file options. Use it when many small writes are generated in a loop.

## Syntax

```java
Files.newBufferedWriter(path, charset, CREATE, TRUNCATE_EXISTING)
```

## Example

```java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class WriteRows {
    public static void main(String[] args) throws IOException {
        Path out = Path.of("out", "rows.txt");
        Files.createDirectories(out.getParent());

        try (BufferedWriter writer = Files.newBufferedWriter(out, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            for (int i = 1; i <= 3; i++) {
                writer.write("row " + i);
                writer.newLine();   // platform line separator
            }
        }
    }
}
```
