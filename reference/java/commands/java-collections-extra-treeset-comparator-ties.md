# TreeSet with a tie breaker

Java command · Sets

Keeps elements sorted and unique by the comparator. A comparator that ignores a field treats two different rows as the same element.

## Syntax

```java
new TreeSet<>(Comparator.comparingInt(Type::key).thenComparing(Type::name))
```

## Example

```java
// Sorted by nights only, so two bookings with 3 nights collide.
TreeSet<Booking> byNights = new TreeSet<>(Comparator.comparingInt(Booking::nights));
byNights.add(new Booking("Danube View", 3));
byNights.add(new Booking("Alpen Hof", 3));
System.out.println(byNights.size());   // 1, one row was dropped

// Add the fields that make the rows different and both survive.
TreeSet<Booking> safe = new TreeSet<>(Comparator
        .comparingInt(Booking::nights)
        .thenComparing(Booking::hotelName));
safe.add(new Booking("Danube View", 3));
safe.add(new Booking("Alpen Hof", 3));
System.out.println(safe.size());       // 2
```

## Details

Inside a `TreeSet`, `compare` returning 0 means duplicate, whatever `equals` says. The set never calls `equals`.

This bites in reports sorted by one field: the set looks correct, the count is short. Add every field that identifies a row, or use a `HashSet` when order does not matter.
