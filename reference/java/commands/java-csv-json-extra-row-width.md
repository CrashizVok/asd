# row width check

Java command · CSV

Compares each parsed row against the header length before any index is used, so a ragged line becomes a message instead of a shifted record.

## Syntax

```java
if (fields.length != header.length) { report and skip }
```

## Example

```java
String[] header = lines.get(0).split(",", -1);

for (int i = 1; i < lines.size(); i++) {
    if (lines.get(i).isBlank()) {
        continue;   // blank line between blocks
    }
    String[] f = lines.get(i).split(",", -1);
    if (f.length != header.length) {
        // One message with the file line number beats an exception with a stack trace.
        System.out.println("line " + (i + 1) + ": expected " + header.length
                + " fields, found " + f.length);
        continue;
    }
    // Safe from here: every index in the header exists in the row.
    System.out.println(f[0] + " -> " + f[2]);
}
```

## Details

The check runs before `col.get("city")`, not after. A row with one extra field is the common shape of a stray comma in a description, and every value after the comma has moved one column to the right.

Keep the `-1` in both splits. Without it a row that ends with an empty field looks shorter than the header and is reported as broken even though it is fine. Report the file line number, which is the array index plus one only when the header is the first line; count from a separate counter if you skipped anything above.
