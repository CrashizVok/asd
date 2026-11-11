# Files.deleteIfExists()

Java command · Copy and move

Deletes a file or an empty directory and reports whether something was removed. A missing path is not an error.

## Syntax

```java
boolean removed = Files.deleteIfExists(path)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CleanExports {
    public static void main(String[] args) throws IOException {
        Path old = Path.of("out", "old-report.txt");

        Files.createDirectories(old.getParent());
        Files.writeString(old, "stale\n");

        // First call removes the file and returns true.
        boolean first = Files.deleteIfExists(old);

        // Second call finds nothing, returns false, throws nothing.
        boolean second = Files.deleteIfExists(old);

        System.out.println(first + " " + second + " exists=" + Files.exists(old));
    }
}
```

## Details

Use this in cleanup code, where the file may already be gone. `Files.delete` is the strict version: it throws `NoSuchFileException` for a missing path and `DirectoryNotEmptyException` for a folder that still holds files. Neither call uses a recycle bin, so a wrong path is gone for good.
