# Distinct values and random pick

Java topic · Exam Wiki

```java
List<String> emails = bookings.stream()
    .map(Booking::customerEmail)
    .distinct()
    .sorted()
    .toList();

Random random = new Random();
String picked = emails.get(random.nextInt(emails.size()));
```

Guard the empty list before calling `random.nextInt(0)`.
