# this(...) or super(...)

Java command · Constructors

Both must be the first statement of a constructor, so a constructor uses one or the other, never both.

## Syntax

```java
this(args);   super(args);
```

## Example

```java
class Booking {
    private final int nights;

    Booking(int nights) {
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
        this.nights = nights;
    }

    int getNights() { return nights; }
}

class RoomBooking extends Booking {
    private final double nightly;
    private final double discount;

    RoomBooking(int nights, double nightly) {
        this(nights, nightly, 0.0);      // chains to the constructor below
    }

    RoomBooking(int nights, double nightly, double discount) {
        super(nights);                   // the chain ends in a super call
        this.nightly = nightly;
        this.discount = discount;
    }

    double total() { return getNights() * nightly - discount; }
}

System.out.println(new RoomBooking(2, 90.0).total());          // 180.0
System.out.println(new RoomBooking(2, 90.0, 30.0).total());    // 150.0
```

## Details

A constructor either delegates to another constructor of the same class with `this(...)` or calls a parent constructor with `super(...)`. The compiler inserts `super()` only when neither is present, and only at the start of the chain. A cycle of `this(...)` calls does not compile. Keep the rules in the longest constructor and let the shorter ones chain into it, so one check covers every path into the class.
