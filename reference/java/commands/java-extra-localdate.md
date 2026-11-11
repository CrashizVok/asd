# LocalDate parse and plusDays

Java command · Date and time

A date without time or zone. parse expects ISO format, plusDays and ChronoUnit handle date arithmetic.

## Syntax

```java
LocalDate.parse("2026-05-01")
```

## Example

```java
// File: BookingDates.java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class BookingDates {
    public static void main(String[] args) {
        LocalDate start = LocalDate.parse("2026-05-01");
        LocalDate end = start.plusDays(7);

        System.out.println(end); // 2026-05-08
        System.out.println(start.isBefore(end)); // true

        // between counts whole days, end minus start
        long nights = ChronoUnit.DAYS.between(start, end);
        System.out.println(nights); // 7

        // LocalDate is immutable, plusDays returns a new object
        System.out.println(start); // 2026-05-01
    }
}
```
