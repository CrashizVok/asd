# record

Java command · OOP

A compact immutable data class. The compiler creates the constructor, accessors, equals, hashCode, and toString.

## Syntax

```java
record Booking(String guest, int nights) {}
```

## Example

```java
record Booking(String guest, int nights) {}

Booking booking = new Booking("Anna", 3);
System.out.println(booking.guest());
System.out.println(booking); // Booking[guest=Anna, nights=3]
```
