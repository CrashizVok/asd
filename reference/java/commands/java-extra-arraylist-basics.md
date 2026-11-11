# ArrayList add, get, size

Java command · Collections

A resizable array. add appends, get reads by index in constant time, and contains uses equals.

## Syntax

```java
new ArrayList<>()
```

## Example

```java
// File: HotelList.java
import java.util.ArrayList;

public class HotelList {
    public static void main(String[] args) {
        ArrayList<String> hotels = new ArrayList<>();
        hotels.add("Danube View");
        hotels.add("City Loft");
        hotels.add("Lake Garden");

        System.out.println(hotels.get(1)); // City Loft
        System.out.println(hotels.size()); // 3

        // contains() calls equals, so casing matters
        System.out.println(hotels.contains("city loft")); // false

        // set replaces, add(index, value) shifts the rest right
        hotels.set(0, "Danube View Spa");
        hotels.add(1, "Bridge Inn");
        System.out.println(hotels); // [Danube View Spa, Bridge Inn, City Loft, Lake Garden]
    }
}
```
