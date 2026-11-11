# Files.writeString

Java command · File IO

Writes a String to a file in one call, creating or truncating the file. Options add append and create behaviour.

## Syntax

```java
Files.writeString(Path.of("file"), text)
```

## Example

```java
// File: WriteReport.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class WriteReport {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("out", "report.txt");
        Files.createDirectories(path.getParent());

        // Default options create or truncate the file
        Files.writeString(path, "hotels" + System.lineSeparator());

        // APPEND keeps the existing content
        Files.writeString(path, "Danube View" + System.lineSeparator(),
            StandardOpenOption.APPEND);

        System.out.println(Files.readString(path));
        // hotels
        // Danube View
    }
}
```
