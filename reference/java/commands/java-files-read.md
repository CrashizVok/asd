# Files.readAllLines and readString

Java command · Files

Reads a whole text file. Use readAllLines for line-by-line processing and readString for one string.

## Syntax

```java
Files.readAllLines(Path.of("file.txt"))
```

## Example

```java
import java.nio.file.*;
import java.util.*;

List<String> lines = Files.readAllLines(Path.of("bookings.csv"));
String all = Files.readString(Path.of("notes.txt"));

for (String line : lines) {
    System.out.println(line);
}
```
