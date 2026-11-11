# @Override

Java command · Inheritance

Marks a method that replaces an inherited one. The compiler checks the signature, so a typo fails the build instead of adding a new method.

## Syntax

```java
@Override ReturnType name(parameters) { ... }
```

## Example

```java
class Booking {
    public double price() { return 0.0; }
}

class RoomBooking extends Booking {
    @Override
    public double price() { return 180.0; }

    // @Override
    // public double price(int guests) { return 0; }
    // compile error: this is an overload, not an override

    // double price() { return 0; }
    // compile error: cannot reduce visibility from public
}
```

## Details

Overriding needs the same name and the same parameter types, at least the same visibility, and a return type that is the same or a subtype. `final`, `static`, and `private` methods cannot be overridden. A static method with the same signature is hidden, and the variable type chooses which one runs. Overloads are chosen at compile time; overrides at runtime.
