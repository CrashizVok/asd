# BufferedReader readLine

Java command · File IO

Reads a file line by line with a buffer. It returns null at the end and does not hold the whole file in memory.

## Syntax

```java
try (BufferedReader reader = Files.newBufferedReader(path))
```

## Example

```java
// File: CountRows.java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CountRows {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("data", "hotels.csv");
        int rows = 0;

        // try with resources closes the reader even when readLine throws
        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.isBlank()) rows++;
            }
        }

        // The header counts too, subtract one when you need data rows only
        System.out.println(rows);
    }
}
```
