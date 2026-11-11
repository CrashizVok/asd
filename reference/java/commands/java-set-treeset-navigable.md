# TreeSet

Java command · Sets

Keeps unique elements sorted. Deduplication uses compareTo or the comparator, not equals.

## Syntax

```java
new TreeSet<E>()
```

## Example

```java
TreeSet<String> hotels = new TreeSet<>();
hotels.add("Danube View");
hotels.add("Alpen Hof");
hotels.add("Danube View");   // ignored, compare result is 0

System.out.println(hotels);        // [Alpen Hof, Danube View]
System.out.println(hotels.first()); // Alpen Hof
System.out.println(hotels.headSet("Danube View"));   // [Alpen Hof]
```
