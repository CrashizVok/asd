# Custom checked exception

Java command · Exceptions

A checked type for an expected failure that carries data. Give it a message constructor, a message plus cause constructor, and only the fields a handler really reads.

## Syntax

```java
class BookingException extends Exception
```

## Example

```java
// File: BookingException.java
// Data shape: BookingException { hotelId: int (0 = not hotel specific), cause: Throwable }
public class BookingException extends Exception {

    // 0 means the failure is not tied to one hotel, for example a whole file.
    private final int hotelId;

    public BookingException(String message) {
        super(message);
        this.hotelId = 0;
    }

    public BookingException(String message, Throwable cause) {
        super(message, cause);
        this.hotelId = 0;
    }

    public BookingException(int hotelId, String message, Throwable cause) {
        super("hotel " + hotelId + ": " + message, cause);
        this.hotelId = hotelId;
    }

    public int hotelId() {
        return hotelId;
    }

    public static void main(String[] args) {
        try {
            throw new BookingException(12, "guests exceed capacity", null);
        } catch (BookingException e) {
            // The handler reads the field, which is the reason the type exists.
            System.out.println(e.getMessage() + " (hotelId=" + e.hotelId() + ")");
        }
    }
}
```

## Details

The class name should say what went wrong, not which layer threw it. `BookingException` tells the handler something; `ServiceException` does not.

Keep the constructors small: `(String message)` and `(String message, Throwable cause)` cover most cases, and a third constructor adds the domain field. A custom exception with no fields and no message building is a rename of `Exception`, so delete it and use a standard type instead.
