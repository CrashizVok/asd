# composition over inheritance

Java command · Composition

Holds another object and calls it instead of extending it. One class, one reason to change.

## Syntax

```java
class A { private final B b; }
```

## Example

```java
interface RefundPolicy {
    double refund(double paid, int daysBeforeStart);
}

class TieredCancel implements RefundPolicy {
    @Override public double refund(double paid, int days) {
        if (days >= 7) return paid;
        if (days >= 2) return paid * 0.5;
        return 0.0;
    }
}

class Booking {
    private final double total;
    private final RefundPolicy policy;      // has-a, not is-a

    Booking(double total, RefundPolicy policy) {
        this.total = total;
        this.policy = policy;
    }

    double refund(int days) {
        return policy.refund(total, days);  // delegate, keep the rule outside
    }
}

System.out.println(new Booking(277.5, new TieredCancel()).refund(3));      // 138.75
System.out.println(new Booking(277.5, (paid, days) -> paid).refund(1));    // 277.5
```

## Details

The test is the is-a sentence. A booking is not a refund rule, so extending `RefundPolicy` would be wrong even when it saves typing. Composition keeps two axes apart: three booking kinds times three refund rules gives three subclasses when the rule is a field, and nine when the rule is a parent. A lambda often replaces the policy class entirely, which an abstract parent can never do.
