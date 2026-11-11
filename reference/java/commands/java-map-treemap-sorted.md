# TreeMap

Java command · Maps

Keeps keys sorted at all times, by natural order or a comparator. Lookup and insert cost logarithmic time.

## Syntax

```java
new TreeMap<K, V>()
```

## Example

```java
// Keys must be Comparable, or pass a Comparator to the constructor.
TreeMap<Integer, Long> byYear = new TreeMap<>();
byYear.put(2024, 57L);
byYear.put(2023, 41L);

System.out.println(byYear.firstKey());        // 2023
System.out.println(byYear.tailMap(2024));     // view from 2024 up
```

## Details

The navigable methods (`firstKey`, `lastKey`, `headMap`, `tailMap`, `floorKey`, `ceilingKey`) are the reason to pick it over a `HashMap` plus a sort. Natural ordering rejects a `null` key.
