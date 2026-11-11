# static interface method

Java command · Interfaces

Called on the interface name. Implementing classes do not inherit it, and it cannot be overridden.

## Syntax

```java
static Type name(args) { ... }
```

## Example

```java
interface Payable {
    double amount();

    static Payable of(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("amount cannot be negative");
        }
        return () -> amount;        // one abstract method, so a lambda fits
    }

    static Payable free() {
        return of(0.0);
    }
}

Payable p = Payable.of(277.5);
System.out.println(p.amount());            // 277.5
System.out.println(Payable.free().amount());   // 0.0

// A static method is not inherited, so there is nothing to override:
// class Line implements Payable {
//     @Override public double amount() { return 0; }
//     @Override public static Payable of(double a) { return null; }   // compile error
// }
```

## Details

A static interface method belongs to the interface, so `Payable.of(...)` works and `p.of(...)` does not compile. An implementing class may declare its own static method with the same name, and it hides instead of overrides, so the type in front of the dot decides which one runs. Use this for factories and validation helpers that belong with the contract but need no object state.
