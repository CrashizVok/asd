# Files.write and BufferedWriter

Java command · Files

Writes text to a file. Files.write replaces the file; use StandardOpenOption.APPEND to add.

## Syntax

```java
Files.write(Path.of("out.txt"), lines)
```

## Example

```java
import java.nio.file.*;
import java.util.*;

List<String> lines = List.of("Anna", "Ben");
Files.write(Path.of("out.txt"), lines);

Files.write(Path.of("out.txt"), List.of("Cara"), StandardOpenOption.APPEND);
```
