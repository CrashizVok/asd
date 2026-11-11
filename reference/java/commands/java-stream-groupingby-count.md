# groupingBy with counting

Java command · Collectors

Builds a map from key to number of rows. The plain one argument form gives key to List instead.

## Syntax

```java
collect(groupingBy(Type::key, counting()))
```

## Example

```java
Map<String, Long> countByCity = bookings.stream()
        .collect(Collectors.groupingBy(
                Booking::city,
                TreeMap::new,          // sorted keys
                Collectors.counting()));

System.out.println(countByCity);   // {Budapest=3, Praha=1, Vienna=1}
```

## Details

Without the map factory the result is a `HashMap`, so group order is arbitrary. A `null` key from the classifier throws `NullPointerException`.
