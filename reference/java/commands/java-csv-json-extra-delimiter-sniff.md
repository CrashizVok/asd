# detect the delimiter

Java command · CSV

A spreadsheet exported in a European locale often writes semicolons. Reading the first line and counting separators costs three lines and saves a file full of one-column rows.

## Syntax

```java
headerLine.indexOf(';') >= 0 && headerLine.indexOf(',') < 0 ? ";" : ","
```

## Example

```java
static String sniffDelimiter(String headerLine) {
    // Semicolon present and comma absent means a semicolon file.
    if (headerLine.indexOf(';') >= 0 && headerLine.indexOf(',') < 0) {
        return ";";
    }
    // Same test for a tab separated export.
    if (headerLine.indexOf('\t') >= 0 && headerLine.indexOf(',') < 0) {
        return "\t";
    }
    return ",";
}

String delimiter = sniffDelimiter(headerLine);
// Pattern.quote keeps a delimiter such as "|" from acting as a regex operator.
String[] header = headerLine.split(Pattern.quote(delimiter), -1);
System.out.println(header.length + " columns, delimiter [" + delimiter + "]");
```

## Details

This is a guess from one line, so treat it as a fallback, not a parser. A header name with a quoted comma defeats the test, and so does a file that uses both characters in different roles. When the task states the separator, use that rather than sniffing.

Always pass the delimiter through `Pattern.quote` to `split`. A pipe, a dot, or a plus is a regex operator and splits somewhere unexpected. Semicolon and tab happen to be safe, but the habit keeps the code correct when the delimiter changes.
