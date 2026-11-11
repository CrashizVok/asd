# anonymous class

Java command · Nested classes

A one-off subclass or interface implementation written where it is used, with no name and no separate file.

## Syntax

```java
new Type() { ... }
```

## Example

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

record Hotel(String name, int stars) { }

List<Hotel> hotels = new ArrayList<>(List.of(
        new Hotel("Hilltop", 3),
        new Hotel("Danube View", 5),
        new Hotel("City Inn", 4)));

Comparator<Hotel> byStars = new Comparator<>() {
    @Override
    public int compare(Hotel a, Hotel b) {
        return Integer.compare(b.stars(), a.stars());   // highest first
    }
};

hotels.sort(byStars);
System.out.println(hotels.get(0).name());   // Danube View
```

## Details

The class body can use effectively final locals from the method around it. Since Java 8 a lambda replaces the anonymous class whenever the target type has a single abstract method, so `hotels.sort((a, b) -> ...)` is shorter. Keep the anonymous form when the type has several methods, or when you need a real body with fields.
