# CSV field quoting

Java command · CSV

Quotes a field only when it contains a comma, a quote, or a line break, and doubles the quotes inside. Required for a CSV that another program can read.

## Syntax

```java
value.contains(",") ? "\"" + value.replace("\"", "\"\"") + "\"" : value
```

## Example

```java
static String csvField(String value) {
    if (value == null) return "";
    boolean needsQuotes = value.contains(",") || value.contains("\"")
            || value.contains("\n") || value.contains("\r");
    return needsQuotes ? "\"" + value.replace("\"", "\"\"") + "\"" : value;
}

System.out.println(csvField("Kovacs, Anna"));   // "Kovacs, Anna"
System.out.println(csvField("He said \"hi\"")); // "He said ""hi"""
```

## Details

A row built with plain `join(",")` breaks on the first city name with a comma. The reader then sees one extra column and every value after it is wrong. Quote on write, and parse quotes on read.
