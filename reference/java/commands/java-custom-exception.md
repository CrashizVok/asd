# custom exception

Java command · Exceptions

Create a specific exception for a domain error. Extend RuntimeException for unchecked, Exception for checked.

## Syntax

```java
class MyException extends RuntimeException { ... }
```

## Example

```java
class BookingException extends RuntimeException {
    BookingException(String message) {
        super(message);
    }
}

throw new BookingException("Hotel is full");
```
