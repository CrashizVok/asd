# CSV header to index map

Java command · CSV

Reads the first line, trims and lowercases each name, and maps a column name to its index. Rows then survive a reordered file.

## Syntax

```java
col.putIfAbsent(header[i].trim().toLowerCase(), i)
```

## Example

```java
import java.util.HashMap;
import java.util.Map;

String headerLine = "customer_email,first_name,last_name";
String[] header = headerLine.split(",", -1);

Map<String, Integer> col = new HashMap<>();
for (int i = 0; i < header.length; i++) {
    col.putIfAbsent(header[i].trim().toLowerCase(), i);
}

String[] row = "anna@example.com,Kovacs,Anna".split(",", -1);
String email = row[col.get("customer_email")].trim();
String first = row[col.get("first_name")].trim();
System.out.println(first + " <" + email + ">");
```

## Details

Check for the columns you need before the loop. A missing key makes `col.get` return null, and unboxing that to an int throws a `NullPointerException` far from the real cause.

If the header starts with `\uFEFF`, a byte order mark from a Windows editor, strip it before splitting.
