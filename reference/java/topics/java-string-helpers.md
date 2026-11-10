# String helpers

Java topic · Exam Wiki

```java
String text = "  Hotel Danube  ";
text.trim();                 // "Hotel Danube"
text.strip();                // Unicode aware trim, Java 11+
text.isBlank();              // true for spaces only
text.toLowerCase();          // locale sensitive
text.toUpperCase(Locale.ROOT);
text.contains("Danube");
text.startsWith("Hotel");
text.substring(0, 5);
text.replace("a", "b");
String.join(", ", List.of("a", "b"));
```

Use `Locale.ROOT` for case changes that must not depend on the machine language.
