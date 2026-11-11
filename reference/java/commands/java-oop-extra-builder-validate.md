# validation in build()

Java command · Builder

Keeps every construction rule in one method, so a builder chain cannot produce an object the class would reject.

## Syntax

```java
Target build() { check fields; return new Target(this); }
```

## Example

```java
final class Guest {
    private final String email;
    private final int adults;
    private final int children;

    private Guest(Builder b) {
        this.email = b.email;
        this.adults = b.adults;
        this.children = b.children;
    }

    static Builder builder() { return new Builder(); }

    static final class Builder {
        private String email;
        private int adults = 1;
        private int children;

        Builder email(String v) { this.email = v; return this; }
        Builder adults(int v) { this.adults = v; return this; }
        Builder children(int v) { this.children = v; return this; }

        Guest build() {
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("valid customer_email is required");
            }
            if (adults < 1) {
                throw new IllegalArgumentException("at least one adult is required");
            }
            if (children < 0) {
                throw new IllegalArgumentException("children cannot be negative");
            }
            return new Guest(this);
        }
    }
}

try {
    Guest.builder().email("broken").adults(2).build();   // throws before an object exists
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
}
```

## Details

`build()` is the only moment when every field is known, so it is the only place where a rule about two fields at once can be checked. Validating inside each setter also duplicates the code and makes the result depend on which setter ran last. The rule to remember: the builder may hold invalid half state, the built object may not.
