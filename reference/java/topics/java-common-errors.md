# Common errors

Java topic · Exam Wiki

| Error | Cause | Fix |
|---|---|---|
| `ArrayIndexOutOfBoundsException` | A row has fewer columns than expected | Use `get(fields, index)` with a bounds check |
| `NumberFormatException` | Empty or quoted numeric field | Trim, check `isEmpty`, strip quotes |
| `DateTimeParseException` | Date is not `yyyy-MM-dd` | Print the bad value before parsing |
| `NullPointerException` | A missing field or a null result | Guard with `isEmpty` or `Optional` |
| `UnsupportedOperationException` | `List.of` was modified | Copy into `new ArrayList<>(...)` |
| `NoSuchFileException` | Wrong relative path | Print `Path.of(...).toAbsolutePath()` |
| `ClassNotFoundException` | JDBC driver missing from classpath | Add the connector jar |
| Output has a trailing comma | Join logic adds a separator after every item | Join with `String.join` or skip the last separator |
