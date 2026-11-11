# String.join() and formatted()

Java command · Strings

Joins fields with a separator and formats a template with positional arguments. Both replace a hand written StringBuilder for short text.

## Syntax

```java
String.join(separator, parts) / template.formatted(args)
```

## Example

```java
// File: FormatRow.java
public class FormatRow {
    public static void main(String[] args) {
        String[] row = {"anna@example.com", "Budapest", "3"};

        // join puts the separator between fields, never after the last one
        System.out.println(String.join(" | ", row));

        // %-24s pads on the right, %s keeps the text as it is
        System.out.printf("%-24s %-10s %s%n", row[0], row[1], row[2]);

        // formatted is String.format with the template on the left
        String note = "%s from %s".formatted(row[0], row[1]);
        System.out.println(note); // anna@example.com from Budapest
    }
}
```
