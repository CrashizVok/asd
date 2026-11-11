# switch pattern

Java command · Pattern matching

Tests the runtime type and binds a variable per arm. Over a sealed type the switch is exhaustive without a default.

## Syntax

```java
switch (value) { case Type name -> ...; }
```

## Example

```java
sealed interface RatePlan permits Nightly, Bundle { }

record Nightly(double nightly) implements RatePlan { }

record Bundle(int nights, double fee, boolean breakfast) implements RatePlan { }

double price(RatePlan plan) {
    return switch (plan) {
        case Nightly n -> n.nightly() * 3;

        // Record pattern: components bound directly. The guard filters this arm.
        case Bundle(int nights, double fee, boolean breakfast) when breakfast ->
                fee + 9.0 * nights;

        case Bundle b -> b.fee();
    };
}

System.out.println(price(new Nightly(92.5)));             // 277.5
System.out.println(price(new Bundle(3, 250.0, true)));   // 277.0
System.out.println(price(new Bundle(2, 250.0, false)));  // 250.0
```

## Details

Order matters: the guarded arm goes before the plain one, because the first match wins. A `null` value throws `NullPointerException` unless a `case null` arm exists. Over a type that is not sealed the compiler cannot prove exhaustiveness, so a `default` is required. Record patterns nest, so `case Wrapper(Bundle(int n, double f, boolean b))` reaches two levels in one line.
