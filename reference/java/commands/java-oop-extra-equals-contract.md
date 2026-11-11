# equals override

Java command · Equality

Compares content instead of identity. The contract asks for reflexive, symmetric, transitive and consistent behaviour, and no exception on null.

## Syntax

```java
public boolean equals(Object other)
```

## Example

```java
import java.util.Objects;

final class BookingKey {
    private final String reference;
    private final int hotelId;

    BookingKey(String reference, int hotelId) {
        this.reference = Objects.requireNonNull(reference);
        this.hotelId = hotelId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;                         // same object, fast path
        if (!(other instanceof BookingKey k)) return false;     // catches null too
        return hotelId == k.hotelId && reference.equals(k.reference);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reference, hotelId);                // same fields as equals
    }
}

System.out.println(new BookingKey("AB-12", 7).equals(new BookingKey("AB-12", 7)));  // true
System.out.println(new BookingKey("AB-12", 7).equals(null));                        // false
```

## Details

`instanceof` with a pattern variable does the cast and the type check in one line, and it returns `false` for `null` without a separate branch. Compare every field that identifies the object, and use the same fields in `hashCode`. Keep those fields `final`: a key whose hash changes after it was put in a `HashSet` is lost inside the set.
