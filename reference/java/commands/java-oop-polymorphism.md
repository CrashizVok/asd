# dynamic dispatch

Java command · Polymorphism

The method that runs is chosen from the object's real class at runtime, not from the variable's declared type.

## Syntax

```java
Parent p = new Child(); p.method();
```

## Example

```java
abstract class Booking {
    abstract double amount();

    String label() {
        return getClass().getSimpleName() + ": " + amount();
    }
}

class RoomBooking extends Booking {
    @Override double amount() { return 180.0; }
}

class EventBooking extends Booking {
    @Override double amount() { return 250.0; }
}

java.util.List<Booking> all = java.util.List.of(
    new RoomBooking(),
    new EventBooking()
);

double sum = 0;
for (Booking b : all) {
    sum += b.amount();       // 180.0 then 250.0
}
System.out.println(sum);     // 430.0
```

## Details

A parent typed variable can hold any subclass object. The compiler checks only that the method exists on the variable type; the JVM picks the overriding version from the object. This is why a loop over a list of the parent type needs no `if` on the concrete class. Overloads behave the opposite way: they are resolved at compile time from the declared type.
