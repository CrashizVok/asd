# String.split()

Java command · Strings

Splits a string on a regular expression and returns the fields as an array. The limit argument decides what happens to empty trailing fields.

## Syntax

```java
text.split(regex, limit)
```

## Example

```java
// File: SplitRow.java
public class SplitRow {
    public static void main(String[] args) {
        String row = "anna@example.com;Budapest;3";
        String[] parts = row.split(";");
        System.out.println(parts.length); // 3

        // plain split drops empty trailing fields, limit -1 keeps them
        String padded = "Eger;2;";
        System.out.println(padded.split(";").length);     // 2
        System.out.println(padded.split(";", -1).length); // 3

        // the dot is a regex wildcard, so it needs escaping
        System.out.println("a.b.c".split("\\.").length); // 3
    }
}
```

## Details

The argument is a regex, not a plain separator. Characters with a meaning in a pattern have to be escaped, and `Pattern.quote(separator)` does that for an arbitrary string.

The limit argument has three useful values. Zero or omitted drops empty trailing fields, which hides a missing column. A negative number keeps every field, so the array length always matches the column count. A positive number splits at most that many times, which is how a field that itself contains the separator survives.

Read the fields with the index you expect only after you check the length. A short row is the normal way a CSV parser throws `ArrayIndexOutOfBoundsException` in an exam.
