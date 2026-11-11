# constructor

Java command · Constructors

Runs once per object, after the fields get their default values. It has no return type and its job is to leave the object valid.

## Syntax

```java
ClassName(parameters) { ... }
```

## Example

```java
class Hotel {
    private final String name;
    private int stars;

    Hotel(String name, int stars) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        this.name = name;
        this.stars = stars;
    }
}

Hotel h = new Hotel("Danube View", 4);
// new Hotel("", 9);   // throws before the object escapes
```

## Details

If you write no constructor, the compiler adds a no argument one. The moment you write any constructor, that free one is gone, so `new Hotel()` stops compiling. Validate inside the constructor: an object that throws there never reaches the rest of the program. A constructor has no return type, not even `void`.
