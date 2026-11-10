# CSV parsing

Java topic · Exam Wiki

Most exam CSV files are simple: comma separated, no quoted commas. `split(",", -1)` keeps empty trailing fields, which matters when the last column is empty.

```java
static String[] parseCsvLine(String line) {
    return line.split(",", -1);
}

static String get(String[] fields, int index) {
    return index < fields.length ? fields[index].trim() : "";
}
```

If a field can contain a comma inside quotes, use the full parser from `java/BookingsCli.java`. Do not write a new one under time pressure.

The header row may be present. Detect it by looking at the first field:

```java
int start = lines.isEmpty() ? 0 : 1;

String first = lines.get(0).split(",", -1)[0].trim();
if (!first.equals("customer_email")) {
    start = 0;
}
```
