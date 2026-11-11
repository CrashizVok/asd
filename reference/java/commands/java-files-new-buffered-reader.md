# Files.newBufferedReader()

Java command · Reading

Opens a BufferedReader with a chosen charset. The usual way to read line by line without depending on the platform default encoding.

## Syntax

```java
Files.newBufferedReader(path, StandardCharsets.UTF_8)
```

## Example

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class CountRows {
    public static void main(String[] args) throws IOException {
        int rows = 0;
        try (BufferedReader reader = Files.newBufferedReader(
                Path.of("bookings.csv"), StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.isBlank()) rows++;
            }
        }
        System.out.println("rows: " + rows);
    }
}
```
