---
id: java-inheritance-deep
lang: Java
title: Inheritance and interfaces in Java
---

# Inheritance and interfaces in Java

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

## More examples

Each file below compiles on its own. Save it under the name in the `// File:` line, run `javac File.java`, then `java ClassName`. Every one is a full program with a `main`, so the output in the comments can be checked line by line.

### Example 5: three levels, one constructor chain

```java
// File: BookingChainDemo.java
// Data shape: Booking { guestEmail, nights } <- RoomBooking { nightly } <- SuiteBooking { suiteFee }
// Three levels, one constructor chain, and every describe() keeps the parent part.

abstract class Booking {
    private final String guestEmail;
    private final int nights;

    Booking(String guestEmail, int nights) {
        if (guestEmail == null || !guestEmail.contains("@")) {
            throw new IllegalArgumentException("guest_email must contain @");
        }
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
        this.guestEmail = guestEmail;
        this.nights = nights;
    }

    // final on the getters: a subclass cannot break the values the rules above approved.
    final String getGuestEmail() { return guestEmail; }

    final int getNights() { return nights; }

    // Each product knows its own rate, so this stays open.
    abstract double nightlyRate();

    // Template method: the check and the multiplication happen once, here.
    final double total() {
        return getNights() * nightlyRate();
    }

    String describe() {
        return getClass().getSimpleName() + " for " + guestEmail
                + ", " + getNights() + " night(s)";
    }
}

class RoomBooking extends Booking {
    private final double nightly;

    RoomBooking(String guestEmail, int nights, double nightly) {
        super(guestEmail, nights);          // runs Booking's validation first
        if (nightly <= 0) {
            throw new IllegalArgumentException("nightly must be positive");
        }
        this.nightly = nightly;
    }

    @Override
    double nightlyRate() { return nightly; }

    @Override
    String describe() {
        return super.describe() + " at " + nightly + "/night";
    }
}

class SuiteBooking extends RoomBooking {
    private final double suiteFee;          // one-off cleaning fee for the suite

    SuiteBooking(String guestEmail, int nights, double nightly, double suiteFee) {
        super(guestEmail, nights, nightly);  // one level up, not two
        this.suiteFee = suiteFee;
    }

    // The fee is spread over the stay so the inherited total() still works unchanged.
    @Override
    double nightlyRate() {
        return super.nightlyRate() + suiteFee / getNights();
    }

    @Override
    String describe() {
        return super.describe() + " plus suite fee " + suiteFee;
    }
}

public class BookingChainDemo {

    public static void main(String[] args) {
        Booking plain = new RoomBooking("anna@example.com", 3, 92.5);
        Booking suite = new SuiteBooking("ben@example.com", 2, 100.0, 40.0);

        // super.describe() in SuiteBooking calls RoomBooking, which calls Booking.
        // super.super.describe() is not legal, but a chain of overrides reaches the top.
        System.out.println(plain.describe());
        System.out.println(plain.total());      // 277.5

        System.out.println(suite.describe());
        System.out.println(suite.total());      // 2 * (100.0 + 40.0 / 2) = 240.0
    }
}
```

`SuiteBooking` calls `super(...)` and lands in `RoomBooking`, which calls `super(...)` again. There is no `super.super.describe()`, but a chain of overrides that each append their own part reaches the grandparent anyway. The rate override uses the same trick on a number: it asks the parent for its rate, then adds the fee spread over the stay. Because `total()` is final, neither subclass can skip the multiplication or drop the validation that ran in `Booking`.

### Example 6: two interfaces with the same default method

```java
// File: ContractDemo.java
// Data shape: InvoiceLine { ref, amount } answers two contracts that both declare label().

import java.util.List;

interface Billable {
    double amount();                                // the only abstract method

    default String label() {
        return "amount " + euros(amount());
    }

    default String shortLabel() {
        return "EUR " + euros(amount());            // shares the helper below
    }

    private String euros(double value) {            // helper, not part of the contract
        return String.format("%.2f", value);
    }

    static Billable zero() {                        // called on the interface name
        return () -> 0.0;                           // one abstract method, so a lambda works
    }
}

interface Auditable {
    String auditRef();

    default String label() {                        // same signature, different meaning
        return "audit " + auditRef();
    }
}

class InvoiceLine implements Billable, Auditable {
    private final String ref;
    private final double amount;

    InvoiceLine(String ref, double amount) {
        this.ref = ref;
        this.amount = amount;
    }

    @Override public double amount() { return amount; }

    @Override public String auditRef() { return ref; }

    // Both interfaces supply label(), so the class must settle the conflict.
    // Deleting this method makes the file fail to compile, and the message names both types.
    @Override
    public String label() {
        return Billable.super.label() + " / " + Auditable.super.label();
    }
}

public class ContractDemo {

    public static void main(String[] args) {
        InvoiceLine line = new InvoiceLine("INV-7", 277.5);

        System.out.println(line.label());        // amount 277.50 / audit INV-7
        System.out.println(line.shortLabel());   // EUR 277.50, inherited default

        Billable free = Billable.zero();
        System.out.println(free.label());        // amount 0.00

        // Two unrelated implementations of one contract go into one list.
        List<Billable> all = List.of(line, free);
        double sum = 0;
        for (Billable b : all) {
            sum += b.amount();
        }
        System.out.println(sum);                 // 277.5
    }
}
```

Two interfaces, one method name, two meanings. Without the override in `InvoiceLine`, the compiler refuses the class and names both interfaces in the error. `Billable.super.label()` is the only syntax that reaches one specific default implementation, and it works only inside the implementing class. The `private` helper shows how an interface keeps shared code out of its contract. `Billable.zero()` shows a static factory reached through the interface name, and a lambda fits it because `amount()` is the only abstract method left.

### Example 7: sealed plans and a switch that cannot miss a case

```java
// File: RatePlanDemo.java
// Data shape: sealed RatePlan = Nightly { nightly } | Bundle { nights, fee, breakfast } | Flat { fee }

import java.util.List;

sealed interface RatePlan permits Nightly, Bundle, Flat { }

record Nightly(double nightly) implements RatePlan { }

record Bundle(int nights, double fee, boolean breakfast) implements RatePlan { }

record Flat(double fee) implements RatePlan { }

final class RateCalculator {

    // No default arm. RatePlan is sealed, so the compiler knows the three permitted
    // records and rejects this file if one case is missing.
    static double price(RatePlan plan, int nights) {
        return switch (plan) {
            case Nightly n -> n.nightly() * nights;

            // Record deconstruction binds the components directly; the guard filters.
            case Bundle(int bNights, double fee, boolean breakfast) when breakfast ->
                    fee + 9.0 * bNights;

            case Bundle b -> b.fee();

            case Flat f -> f.fee();
        };
    }
}

// The three modifiers a sealed hierarchy can hand to a child:
sealed abstract class Plan permits Domestic, International { }

final class Domestic extends Plan { }            // the chain stops here

non-sealed class International extends Plan { }  // reopened, anyone may extend it

class Overseas extends International { }         // legal only because of non-sealed

public class RatePlanDemo {

    public static void main(String[] args) {
        List<RatePlan> plans = List.of(
                new Nightly(92.5),
                new Bundle(3, 250.0, true),
                new Bundle(2, 250.0, false),
                new Flat(180.0)
        );

        for (RatePlan p : plans) {
            System.out.println(p + " -> " + RateCalculator.price(p, 3));
        }

        // Add a fourth record to permits and this file stops compiling
        // until price() handles it. That is the point of sealed.
    }
}
```

Sealed fixes the set of subtypes at compile time. The switch then runs without a `default`, and a new permitted record breaks the build until every arm exists. Record patterns unpack the components straight into the arm, and `when` adds a guard without an `if` inside the body. The three modifiers at the bottom are the whole vocabulary: `final` closes a branch, `non-sealed` reopens it, and a class that is neither must be declared `sealed` again with its own list.

### Example 8: composition when the variation is a rule, not a kind

```java
// File: CompositionDemo.java
// Data shape: Booking { guestEmail, nights, nightly } holds a RefundPolicy.
// Two axes: the kind of booking and the refund rule. Inheritance covers the first,
// a field covers the second, and the two do not multiply.

import java.util.List;

interface RefundPolicy {
    double refund(double paid, int daysBeforeStart);
}

class FreeCancel implements RefundPolicy {
    @Override
    public double refund(double paid, int daysBeforeStart) {
        return paid;                                  // full refund at any time
    }
}

class TieredCancel implements RefundPolicy {
    @Override
    public double refund(double paid, int daysBeforeStart) {
        if (daysBeforeStart >= 7) return paid;
        if (daysBeforeStart >= 2) return paid * 0.5;
        return 0.0;
    }
}

class Booking {
    private final String guestEmail;
    private final int nights;
    private final double nightly;
    private final RefundPolicy policy;                // composed, not inherited

    Booking(String guestEmail, int nights, double nightly, RefundPolicy policy) {
        if (nights < 1) throw new IllegalArgumentException("nights must be at least 1");
        this.guestEmail = guestEmail;
        this.nights = nights;
        this.nightly = nightly;
        this.policy = policy;
    }

    String getGuestEmail() { return guestEmail; }

    int getNights() { return nights; }

    double total() {
        return nights * nightly;
    }

    double refund(int daysBeforeStart) {
        return policy.refund(total(), daysBeforeStart);   // delegate, do not decide here
    }

    String describe() {
        return getClass().getSimpleName() + " for " + guestEmail + ", " + nights + " night(s)";
    }
}

class GroupBooking extends Booking {
    private final int rooms;

    GroupBooking(String guestEmail, int rooms, int nights, double nightly, RefundPolicy policy) {
        super(guestEmail, rooms * nights, nightly, policy);
        this.rooms = rooms;
    }

    @Override
    double total() {
        return super.total() * 0.9;      // ten percent for booking several rooms at once
    }

    int rooms() { return rooms; }
}

public class CompositionDemo {

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("anna@example.com", 3, 92.5, new TieredCancel()),
                new Booking("ben@example.com", 1, 61.0, new FreeCancel()),
                new GroupBooking("cara@example.com", 3, 2, 92.5, new TieredCancel())
        );

        for (Booking b : bookings) {
            System.out.println(b.describe()
                    + " total " + b.total()
                    + " refund in 3 days " + b.refund(3));
        }

        // A new refund rule is one new RefundPolicy class. No Booking subclass,
        // no change to total(), no diamond, no second hierarchy.
        RefundPolicy none = (paid, days) -> 0.0;
        System.out.println(none.refund(100.0, 30));   // 0.0
    }
}
```

Two kinds of change live in this file. A new booking product is a subclass, because the products really are kinds of booking. A new refund rule is a new `RefundPolicy`, because a rule is not a kind of booking, and multiplying subclasses by rules would give six classes for three of each. `refund()` delegates and decides nothing, so the rule can be swapped at construction or replaced by a lambda. `GroupBooking` still calls `super.total()`, which is the one place inheritance earns its keep here.

### Example 9: what the constructor can see

```java
// File: InitOrderDemo.java
// Data shape: Report { title } <- TimedReport { label }, where the parent prints
// a method the child overrides. The output shows a null field, then the real order.

abstract class Report {
    private final String title;

    Report(String title) {
        this.title = title;
        // Legal, and almost always wrong: the child fields are still at their defaults.
        System.out.println("Report ctor sees describe() = " + describe());
    }

    String getTitle() { return title; }

    abstract String describe();
}

class TimedReport extends Report {
    // Not a constant expression, so the assignment really runs after super(...).
    // That is why Report's constructor sees null here, not "timed#2".
    private final String label = "timed".concat("#2");

    TimedReport(String title) {
        super(title);
    }

    @Override
    String describe() {
        return "report " + getTitle() + " [" + label + "]";
    }
}

// The safe version: no overridable call in the constructor. The child passes the
// finished text up, so the parent never asks a half built object a question.
class SafeReport {
    private final String text;

    SafeReport(String title, String suffix) {
        this.text = "report " + title + " [" + suffix + "]";
    }

    @Override
    public String toString() { return text; }
}

class Parent {
    static { System.out.println("1 parent static initializer"); }
    { System.out.println("3 parent instance initializer"); }
    Parent() { System.out.println("4 parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("2 child static initializer"); }
    { System.out.println("5 child instance initializer"); }
    Child() {
        super();                                // implicit here, written for clarity
        System.out.println("6 child constructor");
    }
}

public class InitOrderDemo {

    public static void main(String[] args) {
        System.out.println("before new TimedReport");
        Report r = new TimedReport("Q3 occupancy");   // prints [null] on the first line
        System.out.println(r.describe());             // now the field is set
        System.out.println(new SafeReport("Q3 occupancy", "final"));

        System.out.println("before new Child");
        new Child();
    }
}
```

The first line of the output is the bug. `Report` calls `describe()` before `TimedReport` has assigned `label`, so the override reads null. Making the field `final` does not help, because the assignment still happens after `super(...)`. `SafeReport` shows the fix: build the text and pass it up, or let the caller ask after construction. The numbered lines come from a separate class and show the full order, static initializers above their subclasses, then instance initializers and constructors from the top down.

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
