# JSON string escaping

Java command · JSON

Escapes the characters that JSON does not allow raw: quote, backslash, newline, carriage return, tab, and control characters below 0x20.

## Syntax

```java
switch (c) { case '"': ... case '\\': ... }
```

## Example

```java
static String jsonString(String value) {
    if (value == null) return "null";
    StringBuilder b = new StringBuilder("\"");
    for (char c : value.toCharArray()) {
        switch (c) {
            case '"':  b.append("\\\""); break;
            case '\\': b.append("\\\\"); break;
            case '\n': b.append("\\n");  break;
            case '\r': b.append("\\r");  break;
            case '\t': b.append("\\t");  break;
            default:
                if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
                else b.append(c);
        }
    }
    return b.append('\"').toString();
}

System.out.println(jsonString("He said \"hi\"\\"));
```

## Details

Escape the backslash and the quote; the order matters inside the switch because each character is handled once. A name with a quote that is not escaped produces a file that no JSON parser accepts, and the error usually points at the next line.
