# Files.write() with APPEND

Java command · Writing

Adds lines to the end of a file instead of replacing it. Pass CREATE as well so the first run can create the file.

## Syntax

```java
Files.write(path, lines, charset, CREATE, APPEND)
```

## Example

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

Path log = Path.of("out", "runs.log");
Files.createDirectories(log.getParent());

Files.write(log, List.of("run 1 ok"), StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.APPEND);

Files.writeString(log, "run 2 ok\n", StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

## Details

`APPEND` alone fails with `NoSuchFileException` when the file does not exist yet, and `Files.write` without any option truncates. The pair `CREATE, APPEND` is the one to memorise.
