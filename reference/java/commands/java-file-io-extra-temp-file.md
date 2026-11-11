# Files.createTempFile()

Java command · Temp files

Creates a uniquely named empty file in the given directory. The name is generated, so two runs cannot collide.

## Syntax

```java
Path tmp = Files.createTempFile(dir, "report-", ".tmp")
```

## Example

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class SafeWrite {
    public static void main(String[] args) throws IOException {
        Path out = Path.of("out");
        Files.createDirectories(out);

        // Same folder as the target, so the later move is a rename.
        Path tmp = Files.createTempFile(out, "report-", ".tmp");
        try {
            Files.writeString(tmp, "rows=3\n", StandardCharsets.UTF_8);
            Files.move(tmp, out.resolve("report.txt"), StandardCopyOption.REPLACE_EXISTING);
        } finally {
            // Harmless after a successful move, required after a failed one.
            Files.deleteIfExists(tmp);
        }

        System.out.println(Files.readString(out.resolve("report.txt")).trim());
    }
}
```

## Details

Pass no directory and the file lands in `java.io.tmpdir`, which is a different filesystem on many machines and turns the later move into a copy. The file is not deleted when the JVM exits; `deleteOnExit` exists on `File` but it only runs on a normal shutdown and keeps a reference until then. Create it next to the target and clean it in a `finally`.
