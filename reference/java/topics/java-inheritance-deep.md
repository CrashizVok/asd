# Inheritance and interfaces in Java

Java topic · Exam Wiki

## Simplest form

```java
// Data shape: Booking { guest_email }, RoomBooking adds nights and a nightly price
class Booking {
    private final String guestEmail;

    Booking(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    String getGuestEmail() { return guestEmail; }

    double price() { return 0.0; }
}

class RoomBooking extends Booking {
    private final int nights;

    RoomBooking(String guestEmail, int nights) {
        super(guestEmail);          // parent constructor, must be the first line
        this.nights = nights;
    }

    @Override
    double price() {
        return 90.0 * nights;
    }
}

Booking b = new RoomBooking("anna@example.com", 2);
System.out.println(b.price());      // 180.0: the subclass method runs
```

The variable type is `Booking`, the object type is `RoomBooking`. Java picks the method from the object, not from the variable. That one sentence is polymorphism, and it is the reason inheritance is worth the coupling.

## What it does

`extends` places one class inside another. The subclass inherits every field and method that is not private, gets its own copy of the instance fields, and can add more or replace behaviour. Java allows exactly one parent class per class, so the tree is a chain, not a web.

`implements` makes a class promise to provide the methods an interface declares. A class can implement any number of interfaces. The interface carries no state, only the contract, which is why it can be added to unrelated classes without dragging a parent along.

The two mechanisms solve different problems. Extend when the child really is a special case of the parent and can reuse its code. Implement when unrelated classes must be usable through one type, for example a list of things that all have a price.

## Every part

### extends and the constructor chain

A subclass constructor must run a parent constructor before it touches its own fields. If you write nothing, the compiler inserts `super()` with no arguments. If the parent has no no argument constructor, the subclass will not compile until you call one explicitly.

```java
class Booking {
    private final String guestEmail;

    Booking(String guestEmail) {
        if (guestEmail == null) throw new IllegalArgumentException("guest_email required");
        this.guestEmail = guestEmail;
    }
}

class RoomBooking extends Booking {
    private final int nights;

    RoomBooking(String guestEmail, int nights) {
        super(guestEmail);          // no default constructor exists, so this is required
        this.nights = nights;
    }
}
```

Initialisation runs in a fixed order: parent fields to their defaults, parent constructor body, then subclass fields to their defaults, then the subclass constructor body. Remember that order when a parent constructor calls a method the subclass overrides. The subclass fields are still default at that moment.

### super.method()

`super` reaches the parent version of an overridden method, or a parent field that the subclass hides. There is no separate object behind it. `super` tells the method lookup to start one level up.

```java
class Booking {
    double price() {
        return 0.0;
    }

    String describe() {
        return "booking for " + guestEmail;
    }
}

class RoomBooking extends Booking {
    @Override
    double price() {
        return super.price() + 180.0;   // parent part plus the room part
    }

    @Override
    String describe() {
        return super.describe() + ", " + nights + " nights";
    }
}
```

You cannot write `super.super.price()`. There is one level up only.

### Overriding

Overriding replaces a method with the same name and the same parameter types. The rules that show up in exams:

- The signature must match exactly. A different parameter list is an overload, not an override, and the parent method still runs through a parent typed variable.
- Visibility cannot shrink. A `public` method stays `public`; `protected` can become `public`.
- The return type may be the same or a subtype (covariant return).
- `final`, `static`, and `private` methods cannot be overridden. A static method with the same signature is hidden, and which one runs depends on the variable type.
- `@Override` is optional, but put it on every override. It turns a typo into a compile error instead of a silent new method.

```java
class Booking {
    public double price() { return 0.0; }
}

class RoomBooking extends Booking {
    @Override
    public double price() { return 180.0; }   // good

    // double Price() { ... }                 // compiles as a new method, not an override

    // @Override
    // double price(int n) { ... }            // compile error: different parameters
}
```

### Abstract classes

An abstract class cannot be instantiated. It exists to hold shared state and to force subclasses to fill in the gaps. It may contain concrete methods, abstract methods, fields, and constructors.

```java
abstract class Booking {
    private final String guestEmail;

    Booking(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    String getGuestEmail() { return guestEmail; }

    abstract int nights();            // no body, every subclass must answer

    abstract double nightlyRate();

    double total() {                  // template method, shared by all subclasses
        return nights() * nightlyRate();
    }
}
```

A subclass either implements every abstract method or is declared abstract itself. An abstract method cannot be `private`, `static`, or `final`, because none of those can be overridden.

### Interfaces

An interface is a contract. Before Java 8 it held only abstract methods. Now it can also hold `default` methods with a body and `static` methods. Fields in an interface are implicitly `public static final`, so an interface cannot carry per object state.

```java
interface Payable {
    double amount();                                    // public abstract by default

    default String receiptLine() {                      // shared behaviour
        return "amount due: " + amount();
    }

    static Payable free() {                             // helper, called on the interface
        return () -> 0.0;                               // a lambda, one abstract method
    }
}
```

A class implements an interface with `implements`. The implementing method must be `public`, because the interface method is public even when the keyword is missing.

```java
class RoomBooking implements Payable {
    @Override
    public double amount() {
        return 180.0;
    }
}
```

If two interfaces give the same default method, the class must override it and say which one it means with `InterfaceName.super.method()`.

### Polymorphism

Polymorphism means one variable type, many object types, and the method chosen at runtime from the actual object. The compiler only checks that the method exists on the declared type.

```java
java.util.List<Payable> items = java.util.List.of(
    new RoomBooking("anna@example.com", 2),
    new EventBooking("ben@example.com", 40)
);

double sum = 0;
for (Payable p : items) {
    sum += p.amount();          // RoomBooking.amount or EventBooking.amount
}
```

This is why `List<Payable>` works and `List<Booking>` cannot hold an `EventBooking` that is not a `Booking`. Keep the variable type as general as the code needs, and no more general than that.

To get back to the concrete type, use `instanceof` with a pattern variable. It checks and casts in one step:

```java
if (p instanceof RoomBooking r) {
    System.out.println(r.nights());
}
```

`getClass().getSimpleName()` gives the runtime class name as a string. Use it for logging and exam printouts, not for branching. Branching on class names defeats the polymorphism you just built.

### Inherited Object methods

Every class extends `Object` whether you say so or not. That gives you `toString`, `equals`, `hashCode`, `getClass`, and `clone`. The defaults compare references, so a list of `Booking` objects will not deduplicate until `equals` and `hashCode` are overridden together. Records do this for you.

### Records and interfaces

A record cannot extend a class, because it already extends `Record`. It can implement interfaces, which is often enough:

```java
record Fee(String label, double amount) implements Payable {
    @Override
    public double amount() { return amount; }   // component accessor already exists
}
```

That line is legal but pointless, because the accessor `amount()` already matches the interface. The useful case is a record that implements a contract with a differently named method, or adds a default method from an interface.

## Examples

### Example 1: shared code in the parent, details in the child

```java
// Data shape: Booking { guest_email, nights }, RoomBooking adds nightly
class Booking {
    private final String guestEmail;
    protected final int nights;          // protected: subclasses may read it

    Booking(String guestEmail, int nights) {
        this.guestEmail = guestEmail;
        this.nights = nights;
    }

    String getGuestEmail() { return guestEmail; }

    double price() {
        return 0.0;                      // base bookings cost nothing by themselves
    }

    String describe() {
        return guestEmail + ", " + nights + " nights";
    }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(String guestEmail, int nights, double nightly) {
        super(guestEmail, nights);
        this.nightly = nightly;
    }

    @Override
    double price() {
        return nightly * nights;
    }

    @Override
    String describe() {
        return super.describe() + ", " + nightly + "/night";
    }
}

Booking b = new RoomBooking("anna@example.com", 3, 92.5);
System.out.println(b.price());        // 277.5
System.out.println(b.describe());     // anna@example.com, 3 nights, 92.5/night
```

`nights` is protected because the child reads it directly in `price()`. That is a real trade: protected fields leak into every subclass, so a private field with a protected getter is usually safer. Here the field is final, so the leak cannot corrupt it.

### Example 2: an abstract class with a template method

```java
// Data shape: any booking has nights and a nightly rate
abstract class Booking {
    private final String guestEmail;

    Booking(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    String getGuestEmail() { return guestEmail; }

    abstract int nights();

    abstract double nightlyRate();

    // final: the calculation order is fixed, subclasses only fill the parts
    final double total() {
        int n = nights();
        if (n < 1) throw new IllegalStateException("nights must be positive");
        return n * nightlyRate();
    }
}

class RoomBooking extends Booking {
    private final int nights;
    private final double rate;

    RoomBooking(String guestEmail, int nights, double rate) {
        super(guestEmail);
        this.nights = nights;
        this.rate = rate;
    }

    @Override int nights() { return nights; }

    @Override double nightlyRate() { return rate; }
}

class EventBooking extends Booking {
    private final double flatFee;

    EventBooking(String guestEmail, double flatFee) {
        super(guestEmail);
        this.flatFee = flatFee;
    }

    @Override int nights() { return 1; }

    @Override double nightlyRate() { return flatFee; }
}

Booking a = new RoomBooking("anna@example.com", 2, 90.0);
Booking b = new EventBooking("ben@example.com", 250.0);
System.out.println(a.total());   // 180.0
System.out.println(b.total());   // 250.0
```

`total()` is final, so no subclass can change the order of the calculation or skip the check. That is the template method pattern in its smallest useful form.

### Example 3: one class, two interfaces

```java
// Data shape: an invoice line has a label and an amount
interface Payable {
    double amount();

    default String receiptLine() {
        return "amount due: " + String.format("%.2f", amount());
    }
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
System.out.println(p.receiptLine());          // amount due: 277.50

Describable d = (Describable) p;              // same object, second contract
System.out.println(d.describe());             // Room 3 nights = 277.5
```

The same object answers through two types. `Payable` never learns about `describe`, and `Describable` never learns about money. That separation is the point of interfaces.

### Example 4: a pricing engine, full program

```java
// File: PricingDemo.java
// Every booking is priced through one contract, then handled as Payable.
// Data shape: Booking { guestEmail, nights } with a concrete subclass per product.

import java.util.ArrayList;
import java.util.List;

interface Payable {
    double amount();

    default String receiptLine() {
        return String.format("%.2f", amount());
    }
}

abstract class Booking implements Payable {
    private final String guestEmail;

    Booking(String guestEmail) {
        if (guestEmail == null || !guestEmail.contains("@")) {
            throw new IllegalArgumentException("valid guest_email required");
        }
        this.guestEmail = guestEmail;
    }

    String getGuestEmail() {
        return guestEmail;
    }

    abstract int nights();

    abstract double nightlyRate();

    // Subclasses cannot change the order of this calculation.
    @Override
    public final double amount() {
        return nights() * nightlyRate();
    }

    String describe() {
        return getClass().getSimpleName()
                + " for " + guestEmail
                + ", " + nights() + " night(s), total " + receiptLine();
    }
}

class RoomBooking extends Booking {
    private final int nights;
    private final double nightly;

    RoomBooking(String guestEmail, int nights, double nightly) {
        super(guestEmail);
        if (nights < 1) throw new IllegalArgumentException("nights must be at least 1");
        this.nights = nights;
        this.nightly = nightly;
    }

    @Override int nights() { return nights; }

    @Override double nightlyRate() { return nightly; }

    @Override
    public String toString() {
        return describe();
    }
}

class EventBooking extends Booking {
    private final String room;
    private final double flatFee;

    EventBooking(String guestEmail, String room, double flatFee) {
        super(guestEmail);
        this.room = room;
        this.flatFee = flatFee;
    }

    // An event is billed once, so one billing night keeps amount() correct.
    @Override int nights() { return 1; }

    @Override double nightlyRate() { return flatFee; }

    String room() { return room; }

    @Override
    public String toString() {
        return describe() + " in " + room;
    }
}

public class PricingDemo {

    public static void main(String[] args) {
        // The variable type is Booking, the objects are two different classes.
        List<Booking> bookings = new ArrayList<>();
        bookings.add(new RoomBooking("anna@example.com", 3, 92.5));
        bookings.add(new EventBooking("ben@example.com", "Terrace", 250.0));
        bookings.add(new RoomBooking("cara@example.com", 1, 61.0));

        double total = 0;

        for (Booking b : bookings) {
            // Dynamic dispatch: the subclass amount() runs, not Booking's.
            total += b.amount();
            System.out.println(b);
        }

        System.out.println("bookings: " + bookings.size());
        System.out.println("total: " + String.format("%.2f", total));

        // Pattern matching reaches subclass state without a blind cast.
        for (Booking b : bookings) {
            if (b instanceof EventBooking e) {
                System.out.println("event room: " + e.room());
            }
        }

        // A rejected booking fails at construction, before it joins the list.
        try {
            new RoomBooking("no-at-sign", 2, 90.0);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
```

Read the loop again. `b.amount()` is decided by the object, and `describe()` is inherited from `Booking` while `nights()` and `nightlyRate()` come from the subclass. The parent holds the algorithm, the children hold the numbers. Adding a third product means adding one class and no change to the loop.

## Common mistakes

- Forgetting `super(...)` when the parent has no no argument constructor. The error reads "constructor Booking in class Booking cannot be applied to given types".
- Calling an overridable method inside a constructor. The subclass fields are still default, so the method sees zero and null.
- Leaving off `@Override` and hiding a typo. The method compiles as a new one and the parent version keeps running.
- Changing the parameter list and calling it an override. That is an overload, chosen at compile time from the variable type.
- Narrowing visibility in a subclass. `public` in the parent must stay `public`.
- Expecting `private` methods to be overridden. They are invisible to the subclass and the parent version runs.
- Expecting a `static` method to be overridden. It is hidden, and the variable type decides which one runs.
- Hiding a field with the same name in the subclass. Reads through the parent type see the parent field, which is almost never what you want.
- Building a deep hierarchy for code reuse alone. Prefer composition when the child is not genuinely a kind of the parent.
- Using `getClass().getName()` to branch on type instead of letting a method dispatch.
- Overriding `equals` without `hashCode`. Objects vanish from `HashSet` and `HashMap`.
- Casting without a check. Use `instanceof` with a pattern variable and get a null safe test for free.

## Exam checklist

- Can you write a parent class, a subclass, and a constructor chain with `super(...)` from memory?
- Do you know the initialisation order from parent defaults to subclass constructor body?
- Can you explain the difference between overriding and overloading, including when each is resolved?
- Do you know the four things that cannot be overridden?
- Can you say why an abstract class can have a constructor and an interface cannot?
- Can you list what an interface may contain in modern Java: abstract methods, default methods, static methods, constants?
- Can you write a class that implements two interfaces and explain the cast between them?
- Can you explain why `Booking b = new RoomBooking(...)` calls the subclass method?
- Can you use `instanceof` with a pattern variable to read subclass state?
- Can you point at a template method and say which parts are fixed and which are left to subclasses?
- Do you know why a record cannot extend a class but can implement an interface?
- Can you name one case where composition beats inheritance?

