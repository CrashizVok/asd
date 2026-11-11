# static method

Java command · Static

Belongs to the class. It has no this, so it cannot read instance fields or call instance methods directly.

## Syntax

```java
static ReturnType name(parameters) { ... }
```

## Example

```java
class Price {
    private static final double VAT = 0.27;

    static double withVat(double net) {
        return net * (1 + VAT);
    }

    static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

double gross = Price.withVat(100.0);
System.out.println(gross);              // 127.0
System.out.println(Price.round2(gross));
```

## Details

`Math.max`, `Integer.parseInt`, and `List.of` are all static. A static method is the right home for a pure calculation that needs no object state. A static method cannot be overridden; a subclass can only declare a new one with the same name, and the variable type decides which runs.
