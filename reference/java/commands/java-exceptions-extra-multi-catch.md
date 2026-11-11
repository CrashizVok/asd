# Multi-catch

Java command · Exceptions

Handles several unrelated exception types with one block. The alternatives cannot be subclasses of each other, and the variable only exposes the methods they share.

## Syntax

```java
catch (NumberFormatException | DateTimeParseException e)
```

## Example

```java
// File: MultiCatchParse.java
// Data shape: "id,date" -> Booking(int id, LocalDate date)
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class MultiCatchParse {
    record Booking(int id, LocalDate date) {
    }

    static Booking parse(String line) {
        String[] parts = line.split(",", -1);
        if (parts.length != 2) {
            throw new IllegalArgumentException("expected id,date: " + line);
        }
        try {
            return new Booking(Integer.parseInt(parts[0].trim()), LocalDate.parse(parts[1].trim()));
        } catch (NumberFormatException | DateTimeParseException e) {
            // Both mean the same thing to the caller: the row is malformed.
            throw new IllegalArgumentException("bad row: " + line, e);
        }
    }

    public static void main(String[] args) {
        System.out.println(parse("7,2026-05-01"));
        try {
            parse("7,May 1");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage() + " <- " + e.getCause().getClass().getSimpleName());
        }
    }
}
```

## Details

Order still matters around a multi-catch. A broader clause written above it makes the narrower one unreachable and the compiler rejects the pair. Inside the block, calling a method that exists on only one of the types fails to compile, because the parameter is typed as the closest common supertype.

Do not use `Throwable` or `Exception` in a multi-catch. That is a single wide catch wearing a list, and it hides the failure types the reader needs to see.
