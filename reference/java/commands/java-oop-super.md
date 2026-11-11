# super

Java command · Inheritance

Calls a parent constructor, or the parent version of an overridden method. There is only one level up.

## Syntax

```java
super(args);   super.method();
```

## Example

```java
class Booking {
    protected final int nights;

    Booking(int nights) {
        this.nights = nights;
    }

    String describe() {
        return nights + " night(s)";
    }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(int nights, double nightly) {
        super(nights);
        this.nightly = nightly;
    }

    @Override
    String describe() {
        return super.describe() + ", " + nightly + "/night";
    }
}

System.out.println(new RoomBooking(2, 90.0).describe());
// 2 night(s), 90.0/night
```

## Details

`super(...)` must be the first statement of the constructor. `super.method()` can appear anywhere and is the usual way to keep the parent's part of a description or calculation. `super.super.method()` does not exist in Java.
