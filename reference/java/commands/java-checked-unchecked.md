# Checked and unchecked

Java command · Exceptions

Checked exceptions must be caught or declared. Unchecked exceptions do not, and usually signal a bug or bad input.

## Syntax

```java
void read() throws IOException
```

## Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

class CheckedDemo {
    // Checked: every caller must catch IOException or declare it too.
    static String read(Path path) throws IOException {
        return Files.readString(path);
    }

    // Unchecked: no throws clause, and callers are not forced to catch.
    static int parseStars(String text) {
        int stars = Integer.parseInt(text); // NumberFormatException is unchecked
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        return stars;
    }

    public static void main(String[] args) {
        try {
            System.out.println(read(Path.of("bookings-sample.csv")).length());
        } catch (IOException e) {
            System.out.println("read failed: " + e.getMessage());
        }
    }
}
```

## Details

A useful rule: checked exceptions describe failures outside your control, such as a missing file or a refused connection. Unchecked exceptions describe mistakes inside your code, such as a null reference or an index out of range.

Do not turn every checked exception into a RuntimeException just to avoid a signature. Translate only at a layer boundary, and pass the original exception as the cause.
