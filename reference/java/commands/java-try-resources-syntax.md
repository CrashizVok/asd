# try-with-resources

Java command · Exceptions

Closes every AutoCloseable resource at block end, in reverse declaration order, even when the body throws.

## Syntax

```java
try (Resource a = ...; Resource b = ...) { ... }
```

## Example

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

Path file = Path.of("bookings-sample.csv");

// reader is closed before the catch block runs.
try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
    String line = reader.readLine();
    while (line != null) {
        System.out.println(line);
        line = reader.readLine();
    }
} catch (IOException e) {
    System.out.println("cannot read " + file + ": " + e.getMessage());
}

// Java 9 form for an effectively final variable declared earlier.
BufferedReader other = Files.newBufferedReader(file);
try (other) {
    System.out.println(other.readLine());
}
```

## Details

Multiple resources close in reverse order. Declare Connection, then PreparedStatement, then ResultSet, and the ResultSet closes first, which is what the database expects.

The resource variable is in scope only inside the try block. A catch clause cannot read it.
