# record

Java command · Core

A compact immutable data class. The compiler generates the constructor, accessors, equals, hashCode, and toString.

## Syntax

```java
public record Hotel(String name, int stars) {}
```

## Example

```java
// File: Hotel.java
public record Hotel(String name, String city, int stars) {

    // A compact constructor validates without repeating the fields
    public Hotel {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("stars must be 1 to 5");
        }
        name = name.trim();
    }

    // Extra methods are allowed, extra instance fields are not
    public boolean isTop() {
        return stars >= 4;
    }

    public static void main(String[] args) {
        Hotel hotel = new Hotel(" Danube View ", "Budapest", 5);
        System.out.println(hotel.name());   // Danube View, accessor is name()
        System.out.println(hotel.isTop());  // true
        System.out.println(hotel);          // Hotel[name=Danube View, city=Budapest, stars=5]
    }
}
```
