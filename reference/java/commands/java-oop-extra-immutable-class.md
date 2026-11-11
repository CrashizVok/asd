# immutable class

Java command · Immutability

A class whose state cannot change after construction. Every method that would change it returns a new object instead.

## Syntax

```java
final class Name { private final T field; }
```

## Example

```java
final class Money {
    private final long amountMinor;        // cents, never a double
    private final String currency;

    private Money(long amountMinor, String currency) {
        this.amountMinor = amountMinor;
        this.currency = currency;
    }

    static Money of(long amountMinor, String currency) {
        if (currency == null || currency.length() != 3) {
            throw new IllegalArgumentException("3 letter currency code required");
        }
        return new Money(amountMinor, currency.toUpperCase());
    }

    long amountMinor() { return amountMinor; }
    String currency() { return currency; }

    Money plus(Money other) {              // returns a new object, this stays as it was
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("currency mismatch");
        }
        return new Money(amountMinor + other.amountMinor, currency);
    }
}

Money a = Money.of(9250, "eur");
Money b = a.plus(Money.of(2400, "EUR"));
System.out.println(a.amountMinor());       // 9250, unchanged
System.out.println(b.amountMinor());       // 11650
```

## Details

The recipe in four steps: the class is `final`, every field is `private final`, there is no setter, and every mutable input is copied on the way in. Methods like `plus` return a new instance, so a shared object can never be edited by one caller behind the back of another. `String` and the record types follow the same idea.
