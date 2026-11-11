# typed conversion with defaults

Java command · CSV

Two small helpers return null for an empty or broken field, so the caller decides the default once instead of wrapping every row in a try block.

## Syntax

```java
static Integer parseIntOrNull(String text)
```

## Example

```java
static Integer parseIntOrNull(String text) {
    String t = text.trim();
    if (t.isEmpty()) {
        return null;   // absent, not zero
    }
    try {
        return Integer.valueOf(t);
    } catch (NumberFormatException e) {
        return null;   // present but broken
    }
}

static LocalDate parseDateOrNull(String text) {
    String t = text.trim();
    if (t.isEmpty()) {
        return null;
    }
    try {
        return LocalDate.parse(t);   // strict: 2001-02-30 throws
    } catch (DateTimeParseException e) {
        return null;
    }
}

Integer children = parseIntOrNull(f[4]);
LocalDate birthday = parseDateOrNull(f[5]);
// Empty is fine, junk is a problem. Both arrive as null, so test the text too.
if (children == null && !f[4].trim().isEmpty()) {
    System.out.println("bad children: " + f[4]);
}
int safeChildren = children == null ? 0 : children;
```

## Details

`Integer` rather than `int` is the point of the helper. A primitive has no way to say "missing", and the exam data has optional numeric columns such as `children` where an empty field and a zero mean different things.

Name the default where the record is built, not in the totals. If the task says a broken row must be dropped, record the problem and `continue`; if it says use a default, load it. Mixing the two rules across a program is how the report and the totals stop agreeing.
