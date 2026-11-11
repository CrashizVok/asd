# compute and computeIfPresent

Java command · Maps

Rebuilds the value for a key from the old value. Returning null removes the entry, which makes conditional updates a single call.

## Syntax

```java
map.compute(key, (k, v) -> newValue)
```

## Example

```java
Map<String, Integer> priceByHotel = new HashMap<>();
priceByHotel.put("Danube View", 80);
priceByHotel.put("City Inn", 60);

// Ten percent off, only where a price exists.
priceByHotel.computeIfPresent("Danube View", (key, price) -> price - price / 10);

// compute sees the null for a missing key and can still insert.
priceByHotel.compute("Park Hotel", (key, price) -> price == null ? 110 : price);

// Returning null deletes, so this line removes the cheap hotel.
priceByHotel.computeIfPresent("City Inn", (key, price) -> price < 70 ? null : price);

System.out.println(priceByHotel);
```

## Details

`computeIfAbsent` is the one to reach for when grouping: it only runs the lambda on a miss, so the list is created once and then reused. `computeIfPresent` skips missing keys entirely. `compute` always runs and receives null for a miss.

Do not modify the same map from inside the lambda. The update is already in progress, and a nested put on the same key is undefined behaviour for most implementations.
