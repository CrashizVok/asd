# Word count

Java topic · Exam Wiki

```java
static int wordCount(String text) {
    String trimmed = text == null ? "" : text.trim();
    if (trimmed.isEmpty()) {
        return 0;
    }
    return trimmed.split("\\s+").length;
}
```

This counts whitespace separated words. Punctuation stays attached, which is usually what the exam expects.
