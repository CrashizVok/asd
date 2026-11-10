# Filter, sort, max

Java topic · Exam Wiki

```java
// Filter
List<Booking> in2024 = bookings.stream()
    .filter(b -> b.startDate().getYear() == 2024)
    .toList();

// Sort by nights, longest first
List<Booking> byNights = new ArrayList<>(bookings);
byNights.sort(Comparator.comparingLong(Booking::nights).reversed());

// Longest booking
Booking longest = bookings.stream()
    .max(Comparator.comparingLong(Booking::nights))
    .orElse(null);

if (longest != null) {
    System.out.println(longest.customerEmail() + " " + longest.nights());
}

// Sort by two fields
bookings.sort(
    Comparator.comparing(Booking::startDate)
        .thenComparing(Booking::customerEmail)
);
```

`Comparator.comparingLong` avoids boxing. For a `String` key, use `Comparator.comparing(Booking::customerEmail)`.
