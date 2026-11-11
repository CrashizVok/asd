# Delete a directory tree

Java command · Directories

Removes every file under a folder and then the folder itself. Deleting children first is what makes each step legal.

## Syntax

```java
Files.walk(root).sorted(Comparator.reverseOrder())
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DropScratch {
    public static void main(String[] args) throws IOException {
        Path root = Path.of("scratch");
        Files.createDirectories(root.resolve("a").resolve("b"));
        Files.writeString(root.resolve("a").resolve("b").resolve("x.txt"), "x\n");

        // Collect first. Deleting while the walk stream is open breaks the walk.
        List<Path> victims;
        try (Stream<Path> paths = Files.walk(root)) {
            victims = paths.sorted(Comparator.reverseOrder()).collect(Collectors.toList());
        }

        int deleted = 0;
        for (Path path : victims) {
            try {
                Files.delete(path);
                deleted++;
            } catch (IOException e) {
                // One locked file must not stop the cleanup of the rest.
                System.out.println("kept " + path + ": " + e.getMessage());
            }
        }

        System.out.println("deleted " + deleted + " path(s), root exists=" + Files.exists(root));
    }
}
```

## Details

Reverse path order puts `a/b/x.txt` before `a/b` and `a` before `scratch`, so `Files.delete` never sees a non-empty directory. A locked file on Windows produces an `IOException` on that path only, which is why the try sits inside the loop. `Files.walk` offers no force delete; there is no one call that removes a non-empty tree.
