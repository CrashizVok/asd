# covariant return type

Java command · Polymorphism

An override may return a subtype of the parent return type, so a caller through the child type skips the cast.

## Syntax

```java
@Override Child copy()
```

## Example

```java
class Booking {
    private final int nights;

    Booking(int nights) { this.nights = nights; }

    Booking withNights(int nights) {          // parent returns Booking
        return new Booking(nights);
    }

    int getNights() { return nights; }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(int nights, double nightly) {
        super(nights);
        this.nightly = nightly;
    }

    @Override
    RoomBooking withNights(int nights) {      // narrower return, still an override
        return new RoomBooking(nights, nightly);
    }

    double getNightly() { return nightly; }
}

RoomBooking r = new RoomBooking(2, 90.0).withNights(4);   // no cast here
System.out.println(r.getNights());        // 4
System.out.println(r.getNightly());       // 90.0

Booking b = new RoomBooking(2, 90.0).withNights(4);       // parent type, parent view
System.out.println(b.getClass().getSimpleName());          // RoomBooking
```

## Details

The return type may shrink, never widen, and never change to an unrelated type. This is why `Object.clone()` and many builder methods declare a subtype in their overrides. A parent typed variable still sees the parent return type, so the narrower type only removes a cast where the compiler can already prove the concrete class.
