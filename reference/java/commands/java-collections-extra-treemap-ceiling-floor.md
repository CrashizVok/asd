# floorKey and ceilingKey

Java command · Sorted maps

Returns the nearest key at or below, or at or above, the given key. Both return null when no such key exists.

## Syntax

```java
map.floorKey(key); map.ceilingKey(key)
```

## Example

```java
TreeMap<Integer, String> bandByNights = new TreeMap<>();
bandByNights.put(1, "short stay");
bandByNights.put(3, "weekend");
bandByNights.put(7, "full week");

// 4 nights falls between the 3 and 7 bands.
int lower = bandByNights.floorKey(4);      // 3
int upper = bandByNights.ceilingKey(4);    // 7

System.out.println(lower + " to " + upper);
System.out.println("Band: " + bandByNights.floorEntry(4).getValue());
System.out.println("No cheaper band: " + bandByNights.floorKey(0));   // null
```

## Details

The four methods come in key and entry pairs: `floorKey`, `floorEntry`, `ceilingKey`, `ceilingEntry`. Strict neighbours are `lowerKey` and `higherKey`, which exclude an exact match.

`firstKey` and `lastKey` read the ends. All of them are logarithmic, so a price band lookup stays cheap on a large table.
