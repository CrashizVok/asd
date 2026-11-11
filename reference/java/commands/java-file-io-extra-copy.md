# Files.copy()

Java command · Copy and move

Copies a file's content to another path. Without REPLACE_EXISTING it fails when the target already exists.

## Syntax

```java
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class ArchiveReport {
    public static void main(String[] args) throws IOException {
        Path report = Path.of("out", "report.txt");
        Path archive = Path.of("out", "archive", "report.txt");

        Files.createDirectories(report.getParent());
        Files.writeString(report, "rows=3\n");
        Files.createDirectories(archive.getParent());

        // REPLACE_EXISTING turns the second run from an exception into an overwrite.
        Files.copy(report, archive, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("copied " + Files.size(archive) + " bytes");
    }
}
```

## Details

Without the option the call throws `FileAlreadyExistsException`. Content is copied, attributes are not; add `StandardCopyOption.COPY_ATTRIBUTES` when timestamps matter. Copying a directory creates an empty directory at the target and does not recurse. The parent of the target must exist, because `Files.copy` does not create it.
