# try-with-resources

Java command · Exceptions

Closes resources automatically, even when an exception happens. The resource must implement AutoCloseable.

## Syntax

```java
try (BufferedReader br = Files.newBufferedReader(path)) { ... }
```

## Example

```java
import java.io.*;
import java.nio.file.*;

try (BufferedReader br = Files.newBufferedReader(Path.of("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```
