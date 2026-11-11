# merge

Java command · Maps

Inserts the value when the key is new and combines it with the old value when it exists.

## Syntax

```java
map.merge(key, value, Integer::sum)
```

## Example

```java
Map<String, Integer> revenueByHotel = new HashMap<>();

for (Booking b : bookings) {
    revenueByHotel.merge(b.hotelName(), b.total(), Integer::sum);
}

// Danube View appears three times, the values are added.
System.out.println(revenueByHotel.get("Danube View"));
```
