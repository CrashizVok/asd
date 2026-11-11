# interface

Java command · Interfaces

A contract of methods. A class can implement many interfaces, so one object can be used through several unrelated types.

## Syntax

```java
interface Name { ReturnType m(); }
```

## Example

```java
interface Payable {
    double amount();          // public abstract by default
}

interface Describable {
    String describe();
}

class InvoiceLine implements Payable, Describable {
    private final String label;
    private final double amount;

    InvoiceLine(String label, double amount) {
        this.label = label;
        this.amount = amount;
    }

    @Override public double amount() { return amount; }

    @Override public String describe() { return label + " = " + amount; }
}

Payable p = new InvoiceLine("Room 3 nights", 277.5);
System.out.println(p.amount());                  // 277.5
System.out.println(((Describable) p).describe()); // Room 3 nights = 277.5
```

## Details

Interface methods are implicitly `public abstract`, and a field in an interface is implicitly `public static final`. The implementing method must be `public`, because the contract is public even when the keyword is absent. Cast between interfaces only when you know the object implements both; a blind cast throws `ClassCastException`.
