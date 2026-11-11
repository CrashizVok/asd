# BOM in the header line

Java command · CSV

A UTF-8 file saved on Windows can start with a byte order mark, which attaches to the first header name and breaks a lookup by that name.

## Syntax

```java
if (header.startsWith("\uFEFF")) header = header.substring(1);
```

## Example

```java
List<String> lines = Files.readAllLines(Path.of("hotels.csv"), StandardCharsets.UTF_8);
if (lines.isEmpty()) {
    return;   // nothing to read
}

String headerLine = lines.get(0);
// After readAllLines the BOM is one char, not three bytes.
if (headerLine.startsWith("\uFEFF")) {
    headerLine = headerLine.substring(1);
}
String[] header = headerLine.split(",", -1);

// Without the strip, header[0] is "\uFEFFhotel_id" and containsKey("hotel_id") is false.
System.out.println(header[0]);
```

## Details

The mark appears only at the start of the file, so strip it once from the header line and nowhere else. `Files.readString` behaves the same way: the decoder has already turned the three bytes into `\uFEFF`.

If the file also uses a header you did not write, print the raw first header name with brackets around it, `System.out.println("[" + header[0] + "]")`. An invisible character at the start of the name shows up as an extra column that the map cannot find.
