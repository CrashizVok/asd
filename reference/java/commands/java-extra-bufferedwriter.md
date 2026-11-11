# BufferedWriter newLine

Java command · File IO

Writes text line by line with a buffer. newLine uses the platform separator, unlike a hardcoded backslash n.

## Syntax

```java
try (BufferedWriter writer = Files.newBufferedWriter(path))
```

## Example

```java
// File: ExportCsv.java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ExportCsv {
    public static void main(String[] args) throws IOException {
        List<String> cities = List.of("Budapest", "Eger", "Gyor");
        Path path = Path.of("out", "cities.csv");
        Files.createDirectories(path.getParent());

        try (BufferedWriter writer = Files.newBufferedWriter(path)) {
            writer.write("city");
            writer.newLine();
            for (String city : cities) {
                writer.write(city);
                writer.newLine();
            }
        }

        System.out.println(Files.readAllLines(path).size()); // 4
    }
}
```
