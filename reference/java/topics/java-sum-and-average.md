# Sum and average

Java topic · Exam Wiki

```java
int totalGuests = bookings.stream().mapToInt(Booking::guests).sum();

double averageNights = bookings.stream()
    .mapToLong(Booking::nights)
    .average()
    .orElse(0);

System.out.printf(Locale.US, "Average: %.2f%n", averageNights);
```

Use `Locale.US` when the expected output uses a dot. Hungarian locale prints a comma.
