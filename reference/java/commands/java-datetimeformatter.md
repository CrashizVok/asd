# DateTimeFormatter

Java command · Dates

Formats and parses dates. Use the pattern letters carefully: MM month, dd day, yyyy year.

## Syntax

```java
DateTimeFormatter.ofPattern("yyyy-MM-dd")
```

## Example

```java
import java.time.*;
import java.time.format.*;

LocalDate date = LocalDate.of(2026, 7, 1);
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
System.out.println(date.format(fmt)); // 2026-07-01

LocalDate parsed = LocalDate.parse("2026-07-01", fmt);
```
