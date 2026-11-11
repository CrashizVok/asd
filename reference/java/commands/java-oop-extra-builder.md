# builder pattern

Java command · Builder

Collects many optional constructor arguments in a small mutable helper, then creates the immutable target in one validated step.

## Syntax

```java
Name.builder().field(v).build()
```

## Example

```java
final class Reservation {
    private final String guestEmail;
    private final int hotelId;
    private final int nights;

    private Reservation(Builder b) {
        this.guestEmail = b.guestEmail;
        this.hotelId = b.hotelId;
        this.nights = b.nights;
    }

    static Builder builder() { return new Builder(); }

    @Override
    public String toString() {
        return guestEmail + ", hotel " + hotelId + ", " + nights + " nights";
    }

    static final class Builder {
        private String guestEmail;
        private int hotelId;
        private int nights = 1;              // defaults live in the builder

        Builder guestEmail(String v) { this.guestEmail = v; return this; }
        Builder hotelId(int v) { this.hotelId = v; return this; }
        Builder nights(int v) { this.nights = v; return this; }

        Reservation build() {
            if (guestEmail == null || !guestEmail.contains("@")) {
                throw new IllegalArgumentException("valid guest_email is required");
            }
            if (hotelId <= 0) {
                throw new IllegalArgumentException("hotel_id must be positive");
            }
            if (nights < 1) {
                throw new IllegalArgumentException("nights must be at least 1");
            }
            return new Reservation(this);
        }
    }
}

Reservation r = Reservation.builder()
        .guestEmail("anna@example.com")
        .hotelId(12)
        .nights(3)
        .build();
System.out.println(r);                     // anna@example.com, hotel 12, 3 nights
```

## Details

Each setter returns `this`, so the calls chain and the code reads like a sentence. The builder is mutable and short lived; the object it produces is not. Use it when a constructor would need more than about four arguments, or when several are optional and a positional call becomes unreadable.
