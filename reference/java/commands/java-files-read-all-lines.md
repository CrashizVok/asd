# Files.readAllLines()

Java command · Reading

Reads a whole text file into a List<String>, one element per line with the terminators removed. Simple and fast for exam sized files.

## Syntax

```java
Files.readAllLines(Path.of("bookings.csv"), StandardCharsets.UTF_8)
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

List<String> lines = Files.readAllLines(Path.of("bookings.csv"), StandardCharsets.UTF_8);

for (int i = 0; i < lines.size(); i++) {
    System.out.println((i + 1) + ": " + lines.get(i));
}
```

## Details

A file with no final newline still yields its last line, and a file ending in a newline does not add an empty element. On a very large file this loads everything into memory; use a `BufferedReader` or `Files.lines` instead.
