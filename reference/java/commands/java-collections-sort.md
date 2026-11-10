# Collections.sort and Comparator

Java command · Collections

Sorts a list. Use a Comparator for objects and multiple fields.

## Syntax

```java
list.sort(Comparator.comparing(...))
```

## Example

```java
import java.util.*;

List<String> names = new ArrayList<>(List.of("Cara", "Anna", "Ben"));
names.sort(Comparator.naturalOrder());
names.sort(Comparator.reverseOrder());

List<Booking> bookings = new ArrayList<>();
bookings.sort(Comparator.comparing(Booking::startDate));
```
