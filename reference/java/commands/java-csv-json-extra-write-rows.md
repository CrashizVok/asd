# write CSV rows

Java command · CSV

Writes a finished list of rows in one call, after every field has been quoted where needed.

## Syntax

```java
Files.write(path, rows, StandardCharsets.UTF_8)
```

## Example

```java
static String field(String value) {
    if (value == null) {
        return "";   // null becomes an empty field, not the text "null"
    }
    boolean needsQuotes = value.indexOf(',') >= 0 || value.indexOf('"') >= 0
            || value.indexOf('\n') >= 0 || value.indexOf('\r') >= 0;
    return needsQuotes ? '"' + value.replace("\"", "\"\"") + '"' : value;
}

static String row(String... values) {
    StringBuilder b = new StringBuilder();
    for (int i = 0; i < values.length; i++) {
        if (i > 0) {
            b.append(',');
        }
        b.append(field(values[i]));
    }
    return b.toString();
}

List<String> rows = List.of(
        row("hotel_id", "name", "city"),
        row("10", "Danube View", "Budapest"),
        row("20", "Quote \"Inn\"", "Szeged"));
Files.write(Path.of("out", "hotels.csv"), rows, StandardCharsets.UTF_8);
```

## Details

`Files.write` creates or truncates the file, adds a platform line separator after every row, and writes UTF-8. Create the folder first with `Files.createDirectories(path.getParent())`.

For a report built row by row, open a `BufferedWriter` and call `write(row)` then `newLine()` per row. `newLine()` writes the platform separator; if the file must be identical on every machine, write `"\n"` explicitly and open the file with `StandardOpenOption.CREATE, TRUNCATE_EXISTING`.
