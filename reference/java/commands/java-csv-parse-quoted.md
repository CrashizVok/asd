# CSV parser for quoted fields

Java command · CSV

A small state machine that splits a CSV line while respecting quotes. Handles commas and doubled quotes inside a quoted field.

## Syntax

```java
boolean quoted; char by char; "" -> one quote
```

## Example

```java
static List<String> parseCsvLine(String line) {
    List<String> fields = new ArrayList<>();
    StringBuilder field = new StringBuilder();
    boolean quoted = false;

    for (int i = 0; i < line.length(); i++) {
        char c = line.charAt(i);
        if (quoted) {
            if (c == '"') {
                if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    field.append('"');
                    i++;
                } else {
                    quoted = false;
                }
            } else {
                field.append(c);
            }
        } else if (c == '"') {
            quoted = true;
        } else if (c == ',') {
            fields.add(field.toString());
            field.setLength(0);
        } else {
            field.append(c);
        }
    }

    fields.add(field.toString());
    return fields;
}
```

## Details

The limit: a quote inside an unquoted value, such as `12" screen`, is treated as an opening quote. Check that the quote starts the field when the data can contain that pattern.
