# Files.move()

Java command · Copy and move

Moves or renames a file. On the same filesystem it is a rename, and the bytes are not rewritten.

## Syntax

```java
Files.move(source, target, StandardCopyOption.REPLACE_EXISTING)
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class MarkProcessed {
    public static void main(String[] args) throws IOException {
        Path inbox = Path.of("inbox", "bookings.csv");
        Path done = Path.of("done", "bookings.csv");

        Files.createDirectories(inbox.getParent());
        Files.writeString(inbox, "hotel_id,city\n1,Budapest\n");
        Files.createDirectories(done.getParent());

        // Rename inside one filesystem. REPLACE_EXISTING clears yesterday's file.
        Files.move(inbox, done, StandardCopyOption.REPLACE_EXISTING);

        System.out.println(Files.exists(inbox) + " " + Files.exists(done));
    }
}
```

## Details

`StandardCopyOption.ATOMIC_MOVE` asks for a single step that either happens or does not; it throws `AtomicMoveNotSupportedException` when the filesystem cannot promise that. Across disks the move is a copy followed by a delete, so it costs time proportional to the file size and is not atomic. Moving a non-empty directory fails. `Path.resolveSibling` is the shortest way to rename in place.
