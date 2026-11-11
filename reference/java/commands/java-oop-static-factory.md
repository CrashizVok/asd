# static factory method

Java command · Static

A named static method that builds objects. It can validate first, cache instances, and return a subtype.

## Syntax

```java
static Type of(parameters) { return new Type(...); }
```

## Example

```java
class Hotel {
    private final String name;
    private final int stars;

    private Hotel(String name, int stars) {   // private: use the factory
        this.name = name;
        this.stars = stars;
    }

    static Hotel of(String name, int stars) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        return new Hotel(name.trim(), stars);
    }

    String getName() { return name; }
    int getStars() { return stars; }
}

Hotel h = Hotel.of("  Danube View ", 4);
System.out.println(h.getName());   // Danube View
```

## Details

A factory can have a readable name (`of`, `from`, `valueOf`, `parse`), while a constructor always carries the class name. It can also return a cached instance or a subclass. The cost is that a private constructor blocks inheritance from outside, which is often the point.
