# Files.readString

Java command · File IO

Reads a whole file into one String as UTF-8. It is the shortest option for configuration and small data files.

## Syntax

```java
Files.readString(Path.of("file"))
```

## Example

```java
// File: ReadConfig.java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ReadConfig {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("data", "hotels.csv");

        // UTF-8 is the default, pass a Charset to change it
        String text = Files.readString(path);

        // lines() splits on line breaks without a regex
        List<String> rows = text.lines().toList();
        System.out.println(rows.size());

        // A missing file throws NoSuchFileException, catch it or declare it
    }
}
```
