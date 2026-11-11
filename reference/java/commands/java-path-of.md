# Path.of()

Java command · Paths

Builds a file path from parts without hard coding the separator. A Path is an address only; it does not open or create anything.

## Syntax

```java
Path.of("data", "bookings.csv")
```

## Example

```java
import java.nio.file.Path;

Path file = Path.of("data", "bookings.csv");
System.out.println(file);                       // data/bookings.csv on Linux
System.out.println(file.toAbsolutePath());      // resolved against the working directory

Path backup = file.resolveSibling("backup.csv");
System.out.println(backup);                     // data/backup.csv
```

## Details

`Paths.get` does the same job on Java 7 to 10. Use `Path.of` on Java 11 and later.

A relative path is resolved against the directory where `java` was started, not the folder of the source file. When a read fails unexpectedly, print `toAbsolutePath()` before looking for a bug in the code.
