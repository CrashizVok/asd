# try-with-resources

Java topic · Exam Wiki

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("bookings.csv"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Read failed: " + e.getMessage());
}
```

A resource declared in the parentheses closes automatically, even when an exception is thrown. The resource must implement `AutoCloseable`. Use it for files, streams, and JDBC objects instead of a `finally` block.
