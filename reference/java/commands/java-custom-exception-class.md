# Custom exception

Java command · Exceptions

Defines a failure type the caller can distinguish, optionally carrying fields that the handler needs.

## Syntax

```java
class MyException extends Exception { ... }
```

## Example

```java
// Checked: the caller must decide what to do with a bad row.
class InvalidBookingException extends Exception {
    private final int lineNumber;
    private final String rawLine;

    InvalidBookingException(int lineNumber, String rawLine, String message) {
        super("line " + lineNumber + ": " + message);
        this.lineNumber = lineNumber;
        this.rawLine = rawLine;
    }

    InvalidBookingException(int lineNumber, String rawLine, String message, Throwable cause) {
        super("line " + lineNumber + ": " + message, cause);
        this.lineNumber = lineNumber;
        this.rawLine = rawLine;
    }

    int lineNumber() {
        return lineNumber;
    }

    String rawLine() {
        return rawLine;
    }
}

class Importer {
    static void parse(String line) throws InvalidBookingException {
        if (!line.contains(",")) {
            throw new InvalidBookingException(7, line, "missing separator");
        }
    }

    public static void main(String[] args) {
        try {
            parse("broken row");
        } catch (InvalidBookingException e) {
            System.out.println(e.getMessage());
            System.out.println("raw: " + e.rawLine());
        }
    }
}
```

## Details

Extend Exception for a recoverable, expected failure. Extend RuntimeException for a programming error or invalid argument that every caller would only rethrow.

Always provide a constructor that takes a cause. Without it, callers wrap the original failure in a new exception and lose the stack trace that explains the root.
