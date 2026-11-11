# StandardCharsets.UTF_8

Java command · Charset

The charset to pass to every file call that accepts one. Without it, FileReader and FileWriter use the platform default, which can corrupt accented text.

## Syntax

```java
StandardCharsets.UTF_8
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

Path file = Path.of("nevek.txt");
List<String> lines = List.of("Kovacs Anna", "Toth Cara");

Files.write(file, lines, StandardCharsets.UTF_8);
List<String> back = Files.readAllLines(file, StandardCharsets.UTF_8);
System.out.println(back.get(0));   // Kovacs Anna, accents intact
```

## Details

Read and write with the same charset. A mismatch does not throw; it silently produces question marks or broken characters. `Files.readAllLines(Path)`, `Files.readString(Path)`, and `Files.newBufferedReader(Path)` already use UTF-8, but the explicit overload documents the intent and survives a JDK change.
