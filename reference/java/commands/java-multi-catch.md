# Multi-catch

Java command · Exceptions

Handles several unrelated exception types with one block. The parameter is effectively final.

## Syntax

```java
catch (NumberFormatException | DateTimeParseException e)
```

## Example

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

String start = "2024-13-01";
String adults = "two";

try {
    LocalDate date = LocalDate.parse(start);
    int count = Integer.parseInt(adults);
    System.out.println(date + " " + count);
} catch (DateTimeParseException | NumberFormatException e) {
    // Both failures mean the row is malformed, so one message is enough.
    System.out.println("bad booking row: " + e.getMessage());
}
```

## Details

The alternatives must be unrelated. Writing IOException together with FileNotFoundException does not compile, because the second is a subclass of the first.

The variable type becomes the closest common supertype of the alternatives, so you can call only members that all of them share. Assigning to the parameter is not allowed.
