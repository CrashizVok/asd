# extends

Java command · Inheritance

Inherits the parent's non-private fields and methods, and adds or replaces behaviour. Java allows one parent class only.

## Syntax

```java
class Child extends Parent { ... }
```

## Example

```java
class Booking {
    private final String guestEmail;
    protected final int nights;

    Booking(String guestEmail, int nights) {
        this.guestEmail = guestEmail;
        this.nights = nights;
    }

    String getGuestEmail() { return guestEmail; }

    double price() { return 0.0; }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(String guestEmail, int nights, double nightly) {
        super(guestEmail, nights);      // parent constructor first
        this.nightly = nightly;
    }

    @Override
    double price() { return nightly * nights; }
}

Booking b = new RoomBooking("anna@example.com", 3, 92.5);
System.out.println(b.price());          // 277.5
```

## Details

Private members are not inherited, and a constructor is never inherited. Initialisation order is: parent field defaults, parent constructor, child field defaults, child constructor. A subclass should pass the is-a test; when it only wants the code, composition with a field is the safer design.
