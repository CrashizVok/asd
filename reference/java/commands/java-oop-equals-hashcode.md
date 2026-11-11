# equals and hashCode

Java command · Classes

Define value equality and a matching hash. Override both together or the object misbehaves inside HashSet and HashMap.

## Syntax

```java
@Override public boolean equals(Object o); @Override public int hashCode();
```

## Example

```java
import java.util.Objects;

class Hotel {
    private final String name;
    private final int stars;

    Hotel(String name, int stars) {
        this.name = name;
        this.stars = stars;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Hotel h)) return false;
        return stars == h.stars && name.equals(h.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, stars);
    }
}

Hotel a = new Hotel("Danube View", 4);
Hotel b = new Hotel("Danube View", 4);
System.out.println(a == b);        // false, two objects
System.out.println(a.equals(b));  // true, same values

java.util.Set<Hotel> set = new java.util.HashSet<>();
set.add(a);
set.add(b);
System.out.println(set.size());    // 1
```

## Details

The contract: equal objects must have equal hash codes, and `equals` must be reflexive, symmetric, transitive, and consistent. Comparing with `instanceof` allows subclasses to compare equal; `getClass()` is stricter. Records generate both methods, so a record in a `HashSet` deduplicates with no code. Never use a mutable field in `hashCode` while the object sits in a hash based collection.
