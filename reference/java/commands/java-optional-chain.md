# Optional map and orElse

Java command · Optional

Transforms the value when present and supplies a fallback when empty, without a null check.

## Syntax

```java
optional.map(f).orElse(fallback)
```

## Example

```java
Optional<Booking> best = bookings.stream()
        .max(Comparator.comparingInt(Booking::total));

String label = best
        .map(b -> b.hotelName() + " = " + b.total())
        .orElse("no bookings");

System.out.println(label);
```

## Details

`orElse` evaluates its argument either way; use `orElseGet(() -> ...)` for anything expensive. Avoid `get()` without `isPresent()`, and avoid `Optional` as a field or parameter type.
