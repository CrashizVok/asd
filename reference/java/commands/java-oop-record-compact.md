# compact constructor

Java command · Records

A constructor without a parameter list that validates or normalises the components before the fields are assigned.

## Syntax

```java
record Name(Type a) { Name { validation } }
```

## Example

```java
record HotelRow(int hotelId, String name, int stars) {
    HotelRow {                       // no parentheses: compact form
        if (hotelId <= 0) {
            throw new IllegalArgumentException("hotel_id must be positive");
        }
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1..5");
        }
        name = name == null ? "" : name.trim();   // reassignment is allowed here
    }

    String label() {
        return name + " (" + stars + ")";
    }
}

HotelRow row = new HotelRow(12, "  Danube View  ", 4);
System.out.println(row.name());     // Danube View
System.out.println(row.label());    // Danube View (4)
```

## Details

In the compact form you write only the body, and the compiler assigns each field from the matching parameter at the end. Reassigning a parameter changes what gets stored, which is the clean place to trim or default a value. A record can also declare a normal constructor, but then it must delegate to the canonical one with `this(...)`.
