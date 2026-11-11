# Files.mismatch()

Java command · Compare

Returns the index of the first differing byte, or -1 when two files have identical content. Java 12 and later.

## Syntax

```java
long pos = Files.mismatch(first, second)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class VerifyCopy {
    public static void main(String[] args) throws IOException {
        Path original = Path.of("out", "report.txt");
        Path copy = Path.of("out", "report-copy.txt");

        Files.createDirectories(original.getParent());
        Files.writeString(original, "rows=3\n");
        Files.copy(original, copy, StandardCopyOption.REPLACE_EXISTING);

        // -1 means equal. Any other value is a byte index, not a line number.
        long diff = Files.mismatch(original, copy);
        System.out.println(diff == -1 ? "identical" : "differs at byte " + diff);
    }
}
```

## Details

Both files must exist, otherwise the call throws `NoSuchFileException`. When one file is a prefix of the other, the shorter length is returned, so a truncated copy is reported at the point where it ends. The comparison reads in chunks and never holds either file in memory, which makes it safe for two large files.
