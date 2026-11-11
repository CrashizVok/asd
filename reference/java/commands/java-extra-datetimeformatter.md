# DateTimeFormatter

Java command · Date and time

Formats and parses dates with a pattern. Store the formatter in a static field because it is immutable and thread safe.

## Syntax

```java
DateTimeFormatter.ofPattern("dd/MM/yyyy")
```

## Example

```java
// File: FormatDate.java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class FormatDate {
    // Pattern letters: dd day, MM month, yyyy year, HH hour, mm minute
    private static final DateTimeFormatter DISPLAY =
        DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static void main(String[] args) {
        LocalDate start = LocalDate.parse("2026-05-01");

        System.out.println(start.format(DISPLAY)); // 01/05/2026

        // Parsing needs the same pattern, not the ISO default
        LocalDate parsed = LocalDate.parse("31/12/2026", DISPLAY);
        System.out.println(parsed.getYear()); // 2026

        // ofPattern throws DateTimeParseException on a bad input
    }
}
```
