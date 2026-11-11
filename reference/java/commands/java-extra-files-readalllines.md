# Files.readAllLines

Java command · File IO

Reads a file into a List of lines with the line breaks removed. Convenient for CSV or log files that fit in memory.

## Syntax

```java
Files.readAllLines(Path.of("file"))
```

## Example

```java
// File: ReadCsv.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ReadCsv {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("data", "hotels.csv");
        List<String> lines = Files.readAllLines(path);

        // The first line is usually the header
        System.out.println(lines.get(0));

        // The first split argument is a regex, escape dots and pipes
        for (String line : lines.subList(1, lines.size())) {
            String[] cells = line.split(",");
            System.out.println(cells[0] + " -> " + cells[1]);
        }
    }
}
```
