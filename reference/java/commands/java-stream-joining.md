# joining

Java command · Collectors

Joins stream elements into one string with a delimiter. No trailing comma, unlike a manual loop.

## Syntax

```java
collect(joining(delimiter, prefix, suffix))
```

## Example

```java
String cities = bookings.stream()
        .map(Booking::city)
        .distinct()
        .sorted()
        .collect(Collectors.joining(", ", "[", "]"));

System.out.println(cities);   // [Budapest, Praha, Vienna]
```
