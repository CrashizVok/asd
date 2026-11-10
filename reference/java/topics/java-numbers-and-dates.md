# Numbers and dates

Java topic · Exam Wiki

```java
int adults = Integer.parseInt(get(fields, 9));
int children = Integer.parseInt(get(fields, 10));

// Empty numeric field: use a default instead of throwing.
int count = get(fields, 10).isEmpty() ? 0 : Integer.parseInt(get(fields, 10));

LocalDate start = LocalDate.parse(get(fields, 12)); // yyyy-MM-dd
LocalDate end = LocalDate.parse(get(fields, 13));
long nights = ChronoUnit.DAYS.between(start, end);
```

`LocalDate.parse` throws `DateTimeParseException` on a bad value. For an exam, let it throw and fix the data, or wrap it:

```java
static LocalDate dateOrNull(String text) {
    try {
        return LocalDate.parse(text.trim());
    } catch (DateTimeParseException e) {
        return null;
    }
}
```
