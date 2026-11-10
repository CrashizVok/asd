# Group and count

Java topic · Exam Wiki

```java
Map<Integer, Long> perYear = bookings.stream()
    .collect(Collectors.groupingBy(
        b -> b.startDate().getYear(),
        TreeMap::new,
        Collectors.counting()
    ));

for (Map.Entry<Integer, Long> entry : perYear.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

`TreeMap` keeps the years sorted. For a `HashMap`, sort the keys before printing:

```java
perYear.keySet().stream().sorted().forEach(year ->
    System.out.println(year + ": " + perYear.get(year))
);
```

Count with a plain map when you do not want streams:

```java
Map<String, Integer> counts = new HashMap<>();
for (Booking b : bookings) {
    counts.merge(b.customerEmail(), 1, Integer::sum);
}
```
