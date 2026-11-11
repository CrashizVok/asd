# Files.readAttributes()

Java command · Attributes

Returns type, size, and timestamps for one path in a single call, instead of four separate probes.

## Syntax

```java
Files.readAttributes(path, BasicFileAttributes.class)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;

public class DescribeFile {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("out", "report.txt");
        Files.createDirectories(file.getParent());
        Files.writeString(file, "rows=3\n");

        // One call, one snapshot: type, size and both timestamps.
        BasicFileAttributes attrs =
                Files.readAttributes(file, BasicFileAttributes.class);

        FileTime modified = attrs.lastModifiedTime();
        System.out.println(file.getFileName() + " " + attrs.size() + " bytes");
        System.out.println("dir=" + attrs.isDirectory()
                + " regular=" + attrs.isRegularFile()
                + " modified=" + modified.toInstant());
    }
}
```

## Details

For a directory, `size()` is a filesystem specific number and not the total of its contents. The attributes object says what the entry is; it does not carry Unix permission bits. Those need `PosixFileAttributes` and a `PosixFilePermission` set, which is a different call and is not portable to Windows. `Files.readAttributes` follows symbolic links by default; `LinkOption.NOFOLLOW_LINKS` describes the link itself.
