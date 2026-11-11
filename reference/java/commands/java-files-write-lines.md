# Files.write() with a List

Java command · Writing

Writes an Iterable of lines and puts the platform line separator after each element. Replaces the file by default.

## Syntax

```java
Files.write(path, lines, StandardCharsets.UTF_8)
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

List<String> report = new ArrayList<>();
report.add("city,bookings");
report.add("Budapest,2");
report.add("Szeged,2");

Files.write(Path.of("out", "report.csv"), report, StandardCharsets.UTF_8);
System.out.println(Files.readAllLines(Path.of("out", "report.csv")).size());
```

## Details

The last element also gets a trailing separator, which is fine for CSV and text. Build the list first, then write once; rewriting the file per row is much slower.
