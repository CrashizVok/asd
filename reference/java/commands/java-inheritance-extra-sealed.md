# sealed interface

Java command · Sealed types

Fixes the set of direct subtypes. Each permitted subtype must be final, sealed, or non-sealed.

## Syntax

```java
sealed interface Name permits A, B { }
```

## Example

```java
sealed interface RatePlan permits Nightly, Flat, Corporate { }

record Nightly(double nightly) implements RatePlan { }   // records are final

final class Flat implements RatePlan {                   // branch closed
    private final double fee;

    Flat(double fee) { this.fee = fee; }

    double fee() { return fee; }
}

// non-sealed reopens the branch, so anyone may extend it:
non-sealed class Corporate implements RatePlan { }

class OverseasCorporate extends Corporate { }            // legal only for this reason
```

## Details

A sealed type lists its direct subtypes, and they must sit in the same package, or the same module when a module descriptor is present. Each subtype then says what happens next: `final` stops the branch, `sealed` continues it with another list, `non-sealed` reopens it. The payoff is exhaustiveness: the compiler knows every subtype, so a switch over the sealed type needs no `default` and reports a missing case at build time.
