# Files.createDirectories()

Java command · Paths

Creates a directory and every missing parent, and does nothing if the directory already exists. Call it before writing into a new folder.

## Syntax

```java
Files.createDirectories(out.getParent())
```

## Example

```java
import java.nio.file.Files;
import java.nio.file.Path;

Path out = Path.of("out", "reports", "report.txt");

// Without this line the write throws NoSuchFileException on out/reports.
Files.createDirectories(out.getParent());
Files.writeString(out, "first line\n");
```

## Details

`Files.createDirectory` fails when the parent is missing, so it is the wrong call for a nested output folder. `createDirectories` is also safe to call on every run.
