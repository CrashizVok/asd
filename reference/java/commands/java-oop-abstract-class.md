# abstract class

Java command · Inheritance

A class that cannot be instantiated. It holds shared state and forces subclasses to provide the missing methods.

## Syntax

```java
abstract class Name { abstract ReturnType m(); }
```

## Example

```java
abstract class Booking {
    private final String guestEmail;

    Booking(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    String getGuestEmail() { return guestEmail; }

    abstract int nights();

    abstract double nightlyRate();

    final double total() {
        return nights() * nightlyRate();
    }
}

class RoomBooking extends Booking {
    private final int nights;
    private final double rate;

    RoomBooking(String guestEmail, int nights, double rate) {
        super(guestEmail);
        this.nights = nights;
        this.rate = rate;
    }

    @Override int nights() { return nights; }

    @Override double nightlyRate() { return rate; }
}

System.out.println(new RoomBooking("anna@example.com", 2, 90.0).total());  // 180.0
```

## Details

An abstract class can have fields, constructors, and concrete methods; an interface cannot hold instance state. An abstract method has no body and cannot be `private`, `static`, or `final`. A subclass that misses one abstract method must itself be declared abstract. The `final` template method here fixes the calculation order while subclasses supply the numbers.
