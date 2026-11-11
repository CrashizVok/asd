# record implementing an interface

Java command · Records

A record can satisfy an interface through its generated accessors, so records and classes can share one type in a domain model.

## Syntax

```java
record Name(Type a) implements Contract { }
```

## Example

```java
interface LineItem {
    String label();

    long amountMinor();
}

record RoomCharge(int hotelId, int nights, long nightlyMinor) implements LineItem {
    RoomCharge {
        if (nights < 1) {
            throw new IllegalArgumentException("nights must be at least 1");
        }
    }

    @Override
    public String label() {
        return "hotel " + hotelId + " x" + nights;
    }

    @Override
    public long amountMinor() {
        return nightlyMinor * nights;      // a computed value, the field stays as given
    }
}

record ExtraCharge(String label, long amountMinor) implements LineItem { }
// no methods needed: the generated accessors already match the interface

LineItem a = new RoomCharge(12, 3, 9250);
LineItem b = new ExtraCharge("breakfast", 2400);
System.out.println(a.label() + " " + a.amountMinor());   // hotel 12 x3 27750
System.out.println(b.label() + " " + b.amountMinor());   // breakfast 2400
```

## Details

A record is implicitly `final` and already extends `java.lang.Record`, so it cannot extend a class, but it can implement as many interfaces as you like. `ExtraCharge` gets its two methods for free because the component names are the contract. A record can also override a generated accessor, which is how `amountMinor()` above returns a computed total instead of a stored one.
