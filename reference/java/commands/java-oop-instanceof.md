# instanceof pattern

Java command · Polymorphism

Tests the runtime type and, when it matches, binds the cast object to a new variable in one step.

## Syntax

```java
if (obj instanceof Type name) { ... }
```

## Example

```java
abstract class Booking {
    abstract double amount();
}

class EventBooking extends Booking {
    private final String room;

    EventBooking(String room) { this.room = room; }

    @Override double amount() { return 250.0; }

    String room() { return room; }
}

Booking b = new EventBooking("Terrace");

if (b instanceof EventBooking e) {
    System.out.println("event in " + e.room());   // event in Terrace
}

// The old form needs a separate cast:
if (b instanceof EventBooking) {
    EventBooking e = (EventBooking) b;
    System.out.println(e.room());
}
```

## Details

The pattern variable is in scope only where the test is true, so there is no cast to forget. `instanceof null` is always false, which makes the check safe before any cast. Use it to reach subclass specific state; do not use it to replace dispatch with a chain of type tests, because every new subclass then needs an edit in that chain.
