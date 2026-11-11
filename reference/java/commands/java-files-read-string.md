# Files.readString()

Java command · Reading

Reads the whole file into one String, newlines kept. Available since Java 11.

## Syntax

```java
Files.readString(Path.of("notes.txt"), StandardCharsets.UTF_8)
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

String json = Files.readString(Path.of("hotel.json"), StandardCharsets.UTF_8);

// String.lines() splits on any line break, so this counts rows too.
long lines = json.lines().count();
System.out.println(json.length() + " chars, " + lines + " lines");
```

## Details

Good for a small template or a JSON document that goes to a parser in one piece. To count lines, `lines().count()` or `readAllLines().size()` says it more directly than scanning the string.
