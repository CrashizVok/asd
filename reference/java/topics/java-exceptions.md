# Exceptions

Java topic · Exam Wiki

```java
try {
    int value = Integer.parseInt(text);
    System.out.println(value);
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + text);
}
```

For file work, try with resources closes the reader even when an exception is thrown:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line;
    while ((line = reader.readLine()) != null) {
        // ...
    }
} catch (IOException e) {
    System.out.println("Could not read " + path + ": " + e.getMessage());
}
```
