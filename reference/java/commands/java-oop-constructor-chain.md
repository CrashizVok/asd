# constructor chaining

Java command · Constructors

Calls another constructor of the same class. Keeps validation in one place instead of copying it into every overload.

## Syntax

```java
this(a, b);
```

## Example

```java
class Hotel {
    private final String name;
    private final int stars;
    private final double nightly;

    Hotel(String name, int stars, double nightly) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name");
        if (stars < 1 || stars > 5) throw new IllegalArgumentException("stars");
        this.name = name;
        this.stars = stars;
        this.nightly = nightly;
    }

    Hotel(String name) {
        this(name, 3, 90.0);   // one place holds the rules
    }

    Hotel(String name, int stars) {
        this(name, stars, 90.0);
    }
}
```

## Details

Chain toward the constructor with the most parameters and let it do all the work. Every shorter constructor becomes one line, and a new validation rule is added once. The chain must be a straight line; a cycle of `this(...)` calls does not compile.
