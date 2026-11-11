# protected access

Java command · Inheritance

Visible in the same package and in subclasses anywhere. Wider than most beginners expect, narrower than public.

## Syntax

```java
protected Type field;
```

## Example

```java
class Booking {
    protected final int nights;      // subclasses may read it directly

    Booking(int nights) {
        this.nights = nights;
    }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(int nights, double nightly) {
        super(nights);
        this.nightly = nightly;
    }

    double total() {
        return nights * nightly;     // no getter needed
    }
}

System.out.println(new RoomBooking(2, 90.0).total());   // 180.0
```

## Details

`protected` also exposes the field to every class in the same package, including code that is not a subclass. A `private` field with a `protected` getter gives subclasses read access without giving the whole package write access. Use `protected` for a value a subclass must read to do its job, and keep it `final` so the wider visibility cannot corrupt the object.
