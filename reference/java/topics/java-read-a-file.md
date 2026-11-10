# Read a file

Java topic · Exam Wiki

```java
// Whole file into memory. Fine for exam sized CSV files.
List<String> lines = Files.readAllLines(Path.of("bookings.csv"));

// Line by line. Use this when the file may be large.
try (var reader = Files.newBufferedReader(Path.of("bookings.csv"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

`Files.readAllLines` uses UTF-8 by default in Java 18 and later. On older versions, pass `StandardCharsets.UTF_8`.
