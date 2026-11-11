# merge for counters

Java command · Maps

Adds a value to the number stored under a key, inserting it when the key is new. One call replaces the get, null check, and put sequence.

## Syntax

```java
map.merge(key, value, Integer::sum)
```

## Example

```java
Map<String, Integer> rowsByCity = new HashMap<>();
for (Booking b : bookings) {
    // First hit inserts 1, every later hit adds to the stored value.
    rowsByCity.merge(b.city(), 1, Integer::sum);
}

int budapest = rowsByCity.getOrDefault("Budapest", 0);
System.out.println(rowsByCity);
```

## Details

The same call sums a field instead of counting rows: `rowsByCity.merge(b.city(), b.nights(), Integer::sum)`.

Nesting works because the outer value is a map of its own:

```java
Map<String, Map<String, Integer>> nightsByCityHotel = new TreeMap<>();
for (Booking b : bookings) {
    nightsByCityHotel
            .computeIfAbsent(b.city(), key -> new TreeMap<>())
            .merge(b.hotelName(), b.nights(), Integer::sum);
}
```

A `null` value in the map is treated as absent, so a row that stored null does not throw. Use `putIfAbsent` when the old value must be kept, and `merge` when it must be combined.
