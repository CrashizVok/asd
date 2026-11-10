# LocalDate

Java command · Dates

A date without time. parse reads yyyy-mm-dd. Dates can be compared and subtracted.

## Syntax

```java
LocalDate date = LocalDate.parse("2026-07-01");
```

## Example

```java
import java.time.*;
import java.time.temporal.ChronoUnit;

LocalDate start = LocalDate.parse("2026-07-01");
LocalDate end = LocalDate.parse("2026-07-04");

long nights = ChronoUnit.DAYS.between(start, end);
System.out.println(nights); // 3
System.out.println(start.plusDays(7));
```
