# try with resources

Java command · Core

Closes every resource that implements AutoCloseable, in reverse order, even when the body throws. It replaces the finally block.

## Syntax

```java
try (Resource resource = new Resource()) { ... }
```

## Example

```java
// File: CopyFile.java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CopyFile {
    public static void main(String[] args) throws IOException {
        Path source = Path.of("data", "hotels.csv");
        Path target = Path.of("out", "hotels.csv");
        Files.createDirectories(target.getParent());

        // Both resources are declared in one try, writer closes first
        try (BufferedReader reader = Files.newBufferedReader(source);
             BufferedWriter writer = Files.newBufferedWriter(target)) {

            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
        }

        // The catch block can read the suppressed exception
        // when both the body and close() fail
    }
}
```
