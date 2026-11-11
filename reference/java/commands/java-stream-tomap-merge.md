# toMap with merge

Java command · Collectors

Builds a map from stream elements. The merge function decides what happens when two rows share a key.

## Syntax

```java
collect(toMap(keyMapper, valueMapper, mergeFunction))
```

## Example

```java
Map<String, Integer> revenueByHotel = bookings.stream()
        .collect(Collectors.toMap(
                Booking::hotelName,
                Booking::total,
                Integer::sum,      // duplicates are added, not thrown
                TreeMap::new));

System.out.println(revenueByHotel);
```

## Details

Without the merge function a duplicate key throws `IllegalStateException: Duplicate key`. A fourth argument picks the map implementation, for example `TreeMap::new` for sorted keys.
