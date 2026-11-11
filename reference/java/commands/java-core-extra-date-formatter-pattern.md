# DateTimeFormatter.ofPattern()

Java command · Dates

Builds a display and parse format from a pattern. The same formatter must be used to read the text back, and a locale fixes month names.

## Syntax

```java
DateTimeFormatter.ofPattern(pattern, locale)
```

## Example

```java
// File: StampDate.java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class StampDate {
    public static void main(String[] args) {
        LocalDate date = LocalDate.of(2026, 5, 18);

        // the locale fixes the month name, so another machine cannot change it
        DateTimeFormatter display =
                DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
        System.out.println(date.format(display)); // 18 May 2026

        // parsing needs the same pattern that produced the text
        System.out.println(LocalDate.parse("18 May 2026", display).equals(date)); // true

        // yyyy is the year, MM the month, dd the day; mm would be minutes
        System.out.println(date.format(DateTimeFormatter.ISO_LOCAL_DATE)); // 2026-05-18
    }
}
```

## Details

`yyyy` is the calendar year and `YYYY` is the week based year, which can differ around January. `MM` is the month and `mm` is the minute. `dd` is the day of the month and `DD` is the day of the year. Those four swaps produce output that looks right until the date is near a boundary.

Formatting a date and parsing it back with the same formatter is a cheap round trip test. If the parsed value differs, the pattern is missing a field the text carries.
