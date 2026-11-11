# Files.size()

Java command · Attributes

Returns the length of a file in bytes. For a directory the number is filesystem specific and means nothing useful.

## Syntax

```java
long bytes = Files.size(path)
```

## Example

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class SizeCheck {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("out", "accented.txt");
        Files.createDirectories(file.getParent());

        // One accented char in UTF-8 takes two bytes.
        Files.writeString(file, "caf\u00E9\n", StandardCharsets.UTF_8);

        long bytes = Files.size(file);
        long chars = Files.readString(file, StandardCharsets.UTF_8).length();
        System.out.println("bytes=" + bytes + " chars=" + chars);

        // Always positive, so it can be used as an append guard.
        if (Files.size(file) > 0) {
            Files.writeString(file, "again\n", StandardOpenOption.APPEND);
        }
        System.out.println(Files.size(file) + " bytes after append");
    }
}
```

## Details

The count is bytes, not characters. In UTF-8 an accented letter or an emoji takes more than one byte, so a limit written in characters will not match a limit written in bytes. A missing file throws `NoSuchFileException`; guard with `Files.exists` when the path is optional. To measure a folder, sum the sizes of the files under it.
