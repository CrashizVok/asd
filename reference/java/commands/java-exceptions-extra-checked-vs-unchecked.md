# Checked versus unchecked

Java command · Exceptions

A checked failure comes from outside the program and the compiler forces the caller to decide. An unchecked one marks a bug in the caller and needs no throws clause.

## Syntax

```java
void read(Path file) throws IOException
```

## Example

```java
// File: CheckedVsUnchecked.java
// Data shape: readFirstLine(path) throws IOException; describe(id) throws nothing
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class CheckedVsUnchecked {

    // Checked: the file may be missing, and the caller can offer another path.
    static String readFirstLine(Path file) throws IOException {
        return Files.readAllLines(file).get(0);
    }

    // Unchecked: a negative id is a bug in the caller, not a runtime condition.
    static String describe(int hotelId) {
        if (hotelId < 1) {
            throw new IllegalArgumentException("hotel_id must be positive, got " + hotelId);
        }
        return "hotel " + hotelId;
    }

    public static void main(String[] args) {
        try {
            System.out.println(readFirstLine(Path.of("missing.csv")));
        } catch (IOException e) {
            // The compiler forced this catch, because the failure is expected.
            System.out.println("checked, handled here: " + e.getClass().getSimpleName());
        }

        System.out.println(describe(7));

        try {
            describe(-1);
        } catch (IllegalArgumentException e) {
            // Unchecked, so this catch is a choice, not an obligation.
            System.out.println("unchecked, caught by choice: " + e.getMessage());
        }
    }
}
```

## Details

The test to apply: can a correct program see this failure and recover? A missing file, a closed socket, a rejected login all pass, so they are checked. A null argument, a negative id, a wrong index all mean the code is wrong, so they are unchecked.

Checked is not a mark of quality. A checked exception that every caller wraps in the same unchecked type adds signatures without adding a decision. On the other hand, wrapping an expected file failure as unchecked forces a catch nobody is told about, so the failure surfaces as a crash.

Subclasses of `RuntimeException` and `Error` are unchecked. Everything else below `Throwable` needs a catch or a `throws` clause, and that includes your own `extends Exception` types.
