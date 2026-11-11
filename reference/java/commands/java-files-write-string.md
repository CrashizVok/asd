# Files.writeString()

Java command · Writing

Writes one String to a file. Replaces an existing file unless APPEND is passed. Available since Java 11.

## Syntax

```java
Files.writeString(path, text, StandardCharsets.UTF_8)
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

Path out = Path.of("out", "summary.txt");
Files.createDirectories(out.getParent());

Files.writeString(out, "rows: 12\n", StandardCharsets.UTF_8);
```

## Details

Default options are `CREATE`, `TRUNCATE_EXISTING`, `WRITE`. Add `StandardOpenOption.APPEND` to keep old content. A missing parent folder still throws `NoSuchFileException`, so create the folder first.
