# computeIfAbsent

Java command · Maps

Creates the value on first use and returns it, which builds a map of lists without a null check.

## Syntax

```java
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value)
```

## Example

```java
Map<String, List<Booking>> byCity = new HashMap<>();

for (Booking b : bookings) {
    // The list is created once per city, then reused.
    byCity.computeIfAbsent(b.city(), key -> new ArrayList<>()).add(b);
}

System.out.println(byCity.get("Budapest").size());
```
