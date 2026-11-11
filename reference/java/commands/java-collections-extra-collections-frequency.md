# Collections.frequency

Java command · Counting

Counts how many elements equal the given value. Linear in the collection size, so it is fine for one value and wrong inside a loop over many values.

## Syntax

```java
Collections.frequency(collection, value)
```

## Example

```java
List<String> cities = List.of("Budapest", "Vienna", "Budapest", "Praha");

// One pass over the list per call.
int budapest = Collections.frequency(cities, "Budapest");
System.out.println(budapest);   // 2

// For many values, count once into a map instead of calling frequency per value.
Map<String, Integer> counts = new HashMap<>();
for (String city : cities) {
    counts.merge(city, 1, Integer::sum);
}
System.out.println(counts);
```

## Details

`frequency` uses `equals`, so it works on records and strings without extra code. A custom class needs `equals` for the comparison to mean anything.

A loop of `frequency` calls is quadratic: every call walks the whole list. The single map pass is linear and gives every count at once.
