# Files.write() with byte[]

Java command · Bytes

Writes a byte array to a file. With no options it creates the file or replaces the existing content.

## Syntax

```java
Files.write(Path.of("copy.bin"), data)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CopyBytes {
    public static void main(String[] args) throws IOException {
        Path source = Path.of("logo.png");
        Path target = Path.of("out", "logo-copy.png");

        // Read and write use bytes on both sides, so nothing is decoded.
        byte[] data = Files.readAllBytes(source);
        Files.createDirectories(target.getParent());
        Files.write(target, data);

        System.out.println(Files.size(target) + " bytes written");
    }
}
```

## Details

The default options are `CREATE`, `TRUNCATE_EXISTING`, `WRITE`, so the call replaces old content. Pass `StandardOpenOption.APPEND` to add bytes at the end, and remember that `APPEND` alone fails on a missing file, so pair it with `CREATE`. The text overloads of `Files.write` encode characters; this one does not touch a charset.
