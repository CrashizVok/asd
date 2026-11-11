# Path.resolve

Java command · File IO

Joins path parts without string concatenation. resolve returns the second path when it is absolute, and normalize removes dot segments.

## Syntax

```java
Path.of("base").resolve("file")
```

## Example

```java
// File: PathDemo.java
import java.nio.file.Path;

public class PathDemo {
    public static void main(String[] args) {
        Path base = Path.of("data", "2026");

        // resolve joins, it does not check that the file exists
        Path file = base.resolve("hotels.csv");
        System.out.println(file); // data/2026/hotels.csv

        // An absolute argument replaces the base entirely
        System.out.println(base.resolve(Path.of("/tmp/x.csv"))); // /tmp/x.csv

        // normalize removes . and .. without touching the disk
        System.out.println(Path.of("data/./2026/../2026/hotels.csv").normalize());
        // data/2026/hotels.csv

        System.out.println(file.getFileName());    // hotels.csv
        System.out.println(file.getParent());      // data/2026
    }
}
```
