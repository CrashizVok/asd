# LocalDate plusDays() and ChronoUnit

Java command · Dates

Moves a date by a number of days and counts the days between two dates. LocalDate is immutable, so every change returns a new object.

## Syntax

```java
date.plusDays(n) / ChronoUnit.DAYS.between(a, b)
```

## Example

```java
// File: Nights.java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Nights {
    public static void main(String[] args) {
        LocalDate start = LocalDate.parse("2026-05-11");
        LocalDate end = start.plusDays(7);

        // the original object never changes
        System.out.println(start); // 2026-05-11
        System.out.println(end);   // 2026-05-18

        // a count in days, the usual stay length question
        System.out.println(ChronoUnit.DAYS.between(start, end)); // 7

        // comparisons are methods, not operators
        System.out.println(end.isAfter(start));  // true
        System.out.println(start.isBefore(end)); // true
    }
}
```
