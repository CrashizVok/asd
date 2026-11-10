# Inheritance and interfaces

Java topic · Exam Wiki

```java
interface Payable {
    double amount();
}

abstract class BookingBase {
    abstract double price();
}

class RoomBooking extends BookingBase implements Payable {
    private final double nightly;
    private final int nights;

    RoomBooking(double nightly, int nights) {
        this.nightly = nightly;
        this.nights = nights;
    }

    @Override
    double price() {
        return nightly * nights;
    }

    @Override
    public double amount() {
        return price();
    }
}
```

`extends` shares code, `implements` promises a contract. `@Override` catches a wrong signature. An abstract class can hold shared state; an interface is the public contract. Polymorphism means a `Payable` variable can hold any implementation.
