# Wrap with the cause

Java command · Exceptions

Translates a low level failure into a domain type while keeping the original object as getCause(), so the message and the stack survive.

## Syntax

```java
throw new StoreException(message, cause)
```

## Example

```java
// File: WrapCause.java
// Data shape: StoreException(message, cause=SQLException) -> main reads getCause()
import java.sql.SQLException;

public class WrapCause {

    static class StoreException extends Exception {
        StoreException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // Stands in for the driver: checked, low level, and full of vendor detail.
    static int countRows(String city) throws SQLException {
        if ("?".equals(city)) {
            throw new SQLException("syntax error at or near \"?\"", "42601");
        }
        return 3;
    }

    // Translation point: callers should not need java.sql on their import list.
    static int bookingsIn(String city) throws StoreException {
        try {
            return countRows(city);
        } catch (SQLException e) {
            // Pass e as the second argument. `e.getMessage()` here would lose the cause.
            throw new StoreException("cannot count bookings in " + city, e);
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println(bookingsIn("?"));
        } catch (StoreException e) {
            System.out.println("domain: " + e.getMessage());
            System.out.println("cause: " + e.getCause());
            System.out.println("sql state: " + ((SQLException) e.getCause()).getSQLState());
        }
    }
}
```

## Details

`getCause()` is the whole point. A wrapped exception without the cause answers what failed but not why. When you catch a low level failure and throw a domain type, pass the caught object as the second argument; when you add context to a runtime failure, `new IllegalStateException("msg", e)` keeps it too.

The message belongs to the operation, not to the driver: which call failed and on which key. The cause carries the vendor text, the SQL state, and the line of code.

Do not wrap the same failure twice on the way up. If a method only adds a layer of signature, it should declare the original type instead of inventing another wrapper.
