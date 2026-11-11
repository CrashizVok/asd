# static field

Java command · Static

One value shared by the class, not one per object. Initialised once when the class is loaded.

## Syntax

```java
private static Type name;
```

## Example

```java
class Hotel {
    private static int created;              // one counter for all hotels
    private static final int MAX_STARS = 5;  // shared constant

    private final String name;

    Hotel(String name) {
        this.name = name;
        created++;                            // every object increments it
    }

    static int createdCount() { return created; }
}

new Hotel("Danube View");
new Hotel("Hilltop");
System.out.println(Hotel.createdCount());   // 2
```

## Details

Reach a static field through the class name, `Hotel.created`, not through an object. `static final` on an object type freezes the reference, not the object: a `static final List` can still be added to. Constants use `static final` and upper case names. Static mutable state is global state, so tests that run in one JVM share it.
