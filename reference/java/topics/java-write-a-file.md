# Write a file

Java topic · Exam Wiki

```java
List<String> output = bookings.stream()
    .filter(b -> b.nights() < 3)
    .map(b -> b.customerEmail() + "," + b.hotelId() + "," + b.nights())
    .toList();

Files.write(Path.of("rovidek.txt"), output);
```

`Files.write` creates or overwrites the file. Add `StandardOpenOption.APPEND` to append:

```java
Files.write(path, output, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

Build lines with `StringBuilder` when the format is more complex:

```java
StringBuilder sb = new StringBuilder();
for (Booking b : bookings) {
    sb.append(b.customerEmail())
      .append(";")
      .append(b.nights())
      .append(System.lineSeparator());
}
Files.writeString(Path.of("out.txt"), sb.toString());
```
