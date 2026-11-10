# Record for one row

Java topic · Exam Wiki

```java
record Booking(
    String customerEmail,
    int hotelId,
    LocalDate startDate,
    LocalDate endDate,
    int adults,
    int children,
    int boylovers
) {
    long nights() {
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    int guests() {
        return adults + children + boylovers;
    }
}
```

Records give you the constructor, accessors, `equals`, `hashCode`, and `toString` for free. Accessors are `b.startDate()`, not `b.getStartDate()`.
