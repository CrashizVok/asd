# Lists

Java topic · Exam Wiki

```java
List<Booking> bookings = new ArrayList<>();

for (String line : lines) {
    String[] f = parseCsvLine(line);
    bookings.add(new Booking(
        get(f, 0),
        Integer.parseInt(get(f, 6)),
        LocalDate.parse(get(f, 12)),
        LocalDate.parse(get(f, 13)),
        Integer.parseInt(get(f, 14)),
        Integer.parseInt(get(f, 15)),
        Integer.parseInt(get(f, 16))
    ));
}

System.out.println("Bookings: " + bookings.size());
```

Use `List.of(...)` only for a fixed list. It is immutable, so `add` throws `UnsupportedOperationException`.
