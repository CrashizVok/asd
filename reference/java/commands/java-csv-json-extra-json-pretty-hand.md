# pretty print JSON without a library

Java command · JSON

Indents a compact JSON string by scanning characters and tracking one flag: inside a string, where braces and commas are data.

## Syntax

```java
static String pretty(String compactJson)
```

## Example

```java
static String pretty(String json) {
    StringBuilder out = new StringBuilder();
    int depth = 0;
    boolean inString = false;
    boolean escaped = false;

    for (int i = 0; i < json.length(); i++) {
        char c = json.charAt(i);
        if (inString) {
            out.append(c);
            if (escaped) {
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                inString = false;   // closing quote, structure resumes
            }
        } else if (c == '"') {
            inString = true;
            out.append(c);
        } else if (c == '{' || c == '[') {
            out.append(c).append('\n');
            depth++;
            out.append("  ".repeat(depth));
        } else if (c == '}' || c == ']') {
            out.append('\n');
            depth--;
            out.append("  ".repeat(Math.max(depth, 0)));
            out.append(c);
        } else if (c == ',') {
            out.append(",\n").append("  ".repeat(depth));
        } else if (c == ':') {
            out.append(": ");
        } else if (!Character.isWhitespace(c)) {
            out.append(c);   // whitespace outside strings is rebuilt by the indenter
        }
    }
    return out.toString();
}

System.out.println(pretty("{\"city\":\"Budapest\",\"tags\":[\"river\"]}"));
```

## Details

The `escaped` flag is not optional. Without it the value `"say \"hi\""` closes the string at the first escaped quote, and every following character is treated as structure.

The printer does not validate. It never checks that braces match, and it copies an unescaped control character through. An empty object comes out as an opening brace, a newline, a closing brace, which is valid JSON and not what a library would print.

When Jackson is on the classpath, `mapper.writerWithDefaultPrettyPrinter().writeValueAsString(mapper.readTree(json))` does the same job with correct handling of every case.
