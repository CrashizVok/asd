# subMap range view

Java command · Sorted maps

Returns a view of the entries between two keys. The booleans decide whether each bound is included.

## Syntax

```java
map.subMap(from, true, to, false)
```

## Example

```java
TreeMap<Integer, Long> revenueByYear = new TreeMap<>();
revenueByYear.put(2021, 3100L);
revenueByYear.put(2022, 4200L);
revenueByYear.put(2023, 3900L);
revenueByYear.put(2024, 5100L);

// 2022 and 2023 only: low bound included, high bound excluded.
System.out.println(revenueByYear.subMap(2022, true, 2024, false));

// Views are backed by the map, so a write through one is a write to the other.
revenueByYear.subMap(2022, true, 2024, false).clear();
System.out.println(revenueByYear);   // 2021 and 2024 remain
```

## Details

`headMap(to, inclusive)` and `tailMap(from, inclusive)` are the one sided forms. Without the boolean, `subMap(from, to)` includes the low key and excludes the high one.

A view is not a copy. Removing through it changes the original map, and adding a key outside the range throws `IllegalArgumentException`. Copy into an `ArrayList` when the caller needs an independent snapshot.
