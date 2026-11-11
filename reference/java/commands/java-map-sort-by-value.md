# Sort map entries

Java command · Sorting

Sorts a copy of the entry set when the report order is by value. A map itself has no order to sort.

## Syntax

```java
entries.sort(Map.Entry.comparingByValue())
```

## Example

```java
Map<String, Integer> revenue = new HashMap<>();
revenue.put("Danube View", 640);
revenue.put("City Inn", 180);
revenue.put("Alpen Hof", 380);

List<Map.Entry<String, Integer>> ranking = new ArrayList<>(revenue.entrySet());
ranking.sort(Map.Entry.<String, Integer>comparingByValue().reversed());

ranking.forEach(e -> System.out.println(e.getKey() + " = " + e.getValue()));
```

## Details

Add a tie breaker with `.thenComparing(Map.Entry.comparingByKey())`. For a map that stays sorted by value, keep a `TreeMap` keyed by the value instead, or sort on each print.
