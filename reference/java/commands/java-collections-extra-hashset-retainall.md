# retainAll and removeAll

Java command · Sets

Keeps only the elements also present in another collection, or drops every element found there. Both edit the set in place.

## Syntax

```java
set.retainAll(other); set.removeAll(other)
```

## Example

```java
Set<String> bookedCities = new HashSet<>(List.of("Budapest", "Vienna", "Praha"));
Set<String> servedCities = new HashSet<>(List.of("Vienna", "Praha", "Graz"));

// Intersection: cities in both sets.
Set<String> both = new HashSet<>(bookedCities);
both.retainAll(servedCities);
System.out.println(both);   // [Vienna, Praha]

// Difference: booked but not served. removeAll edits the copy, not the original.
Set<String> missing = new HashSet<>(bookedCities);
missing.removeAll(servedCities);
System.out.println(missing);   // [Budapest]
```

## Details

`retainAll` returns true when the set changed, so it doubles as a change check.

Copy first when the original set must survive. `removeAll` on the original is the common slip: the report then runs on an emptied set. For a union, add everything into a copy instead.

Both methods are linear in the smaller collection's size when the argument is a set.
