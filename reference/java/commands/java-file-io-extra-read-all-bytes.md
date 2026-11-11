# Files.readAllBytes()

Java command · Bytes

Reads the whole file as raw bytes. The right call for an image, a zip, or a PDF, where a charset would corrupt the content.

## Syntax

```java
byte[] data = Files.readAllBytes(Path.of("logo.png"))
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ReadBytes {
    public static void main(String[] args) throws IOException {
        // No decoding. The array holds exactly the bytes that sit on disk.
        byte[] data = Files.readAllBytes(Path.of("logo.png"));

        // Java bytes are signed, so mask one before printing it as 0..255.
        System.out.println(data.length + " bytes, first=" + (data[0] & 0xFF));
    }
}
```

## Details

The file must exist; a missing path throws `NoSuchFileException`. Loading everything is fine for a photo and wrong for a large archive, where `Files.newInputStream` keeps memory flat. When the file does not fit, the failure is `OutOfMemoryError`, not `IOException`, so a catch block for `IOException` will not see it.
