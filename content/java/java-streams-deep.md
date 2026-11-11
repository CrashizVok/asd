---
id: java-streams-deep
lang: Java
title: Java streams
---

# Java streams

A stream is a loop with the bookkeeping removed. You say what should happen to each row, and the
JDK decides how to walk the data. The exam uses it for three jobs: filter rows, turn rows into a
number, and group rows into a report. Once you can read a pipeline as source, steps, result, the
syntax stops being decoration.

## Simplest form

```java
// Data shape: List<Booking>, one element per row, each field reachable by a getter
long longStays = bookings.stream()
        .filter(b -> b.nights() >= 3)
        .count();
```

`stream()` opens the pipeline, `filter` keeps some rows, `count` closes the pipeline and returns a
`long`. Nothing is copied and nothing is sorted. The list is unchanged after the call.

## What it does

A pipeline has three parts:

1. A source, such as `list.stream()`, `Arrays.stream(array)`, `Stream.of(a, b)`, or
   `Files.lines(path)`. One pipeline uses one source.
2. Zero or more intermediate operations, such as `filter`, `map`, `sorted`, or `distinct`. Each
   one returns a new stream and does no work yet.
3. Exactly one terminal operation, such as `collect`, `count`, `sum`, `forEach`, or `max`. This is
   the call that runs the pipeline and produces a value or a side effect.

Intermediate operations are lazy. A pipeline with no terminal operation does nothing at all,
which is why a forgotten `collect` looks like a silent bug. Laziness also allows short circuiting:
`findFirst` after a `filter` stops at the first match instead of walking the rest.

A stream is single use. After the terminal call it is consumed, and reusing the variable throws
`IllegalStateException: stream has already been operated upon or closed`. Build a new stream from
the source when you need a second pass.

A stream does not modify its source. `filter` returns a view of the elements that passed, not a
list with rows deleted. If you need the result stored, collect it.

## Every part

### Sources

```java
List<Booking> list = /* ... */;
Stream<Booking> fromList = list.stream();
Stream<String> fromValues = Stream.of("a", "b");
IntStream range = IntStream.rangeClosed(1, 5);          // 1 2 3 4 5
Stream<String> lines = Files.lines(Path.of("bookings.csv"));
Stream<Map.Entry<String, Long>> entries = map.entrySet().stream();
```

`map.keySet().stream()` and `map.values().stream()` cover the other two map views. A `Map` itself
has no `stream()` method.

### Intermediate operations

- `filter(predicate)` keeps elements where the predicate is true.
- `map(function)` turns each element into something else. One input, one output.
- `mapToInt`, `mapToLong`, `mapToDouble` turn a stream into a primitive stream, which avoids
  boxing and unlocks `sum()` and `average()`.
- `flatMap(function)` turns each element into a stream and joins them. Use it when one row holds
  a list, for example the guests of a booking.
- `distinct()` removes duplicates using `equals`. On a stream of objects this needs a working
  `equals` and `hashCode`.
- `sorted()` uses natural order and fails on non `Comparable` elements. `sorted(comparator)` is
  the form you want most of the time.
- `limit(n)` and `skip(n)` cut the stream short.
- `peek(consumer)` runs a side effect per element. Keep it for debugging, not for logic.
- `takeWhile` and `dropWhile` stop or start at the first element that fails the predicate.

### Terminal operations

- `collect(collector)` builds a collection or a value. The most flexible ending.
- `toList()` returns an unmodifiable list. `collect(Collectors.toList())` returns a mutable list
  in current JDKs, with no promise about the concrete class.
- `count()` returns `long`.
- `forEach(consumer)` exists for printing. It does not preserve order in a parallel stream.
- `reduce(identity, accumulator)` folds the stream into one value.
- `min(comparator)` and `max(comparator)` return `Optional`, because the stream may be empty.
- `anyMatch`, `allMatch`, and `noneMatch` return `boolean` and stop at the first decisive element.
- `findFirst()` and `findAny()` return `Optional`.
- `sum()` and `average()` exist only on primitive streams. `average()` returns `OptionalDouble`.

### Collectors: the useful set

```java
// Data shape: List<Booking>, the output shapes are in the comments
List<String> names = bookings.stream().map(Booking::guestName).toList();
String csv = bookings.stream().map(Booking::hotelName)
        .collect(Collectors.joining(", ", "[", "]"));
long guests = bookings.stream().map(Booking::customerEmail).distinct().count();
```

`joining` takes an optional delimiter, prefix, and suffix. It is the shortest way to build the
comma separated line that exam tasks ask for, and it never leaves a trailing comma:

```java
String line = bookings.stream()
        .map(b -> b.city() + ": " + b.nights())
        .collect(Collectors.joining(", "));
```

`toMap` needs a key mapper and a value mapper. Adding a merge function handles duplicate keys,
which otherwise throw `IllegalStateException: Duplicate key`. The fourth argument picks the map
implementation:

```java
Map<String, Integer> revenueByHotel = bookings.stream()
        .collect(Collectors.toMap(
                Booking::hotelName,
                Booking::total,
                Integer::sum,      // two rows for one hotel are added
                TreeMap::new));    // sorted keys in the result
```

Without `Integer::sum`, two bookings in the same hotel crash the program. This is the most common
stream failure in exam code.

### groupingBy

`groupingBy(classifier)` returns `Map<K, List<T>>`: each key maps to the rows that produced it.

```java
Map<String, List<Booking>> byCity = bookings.stream()
        .collect(Collectors.groupingBy(Booking::city));
```

The two argument form adds a downstream collector, which decides what each group becomes. The
three argument form also chooses the map implementation.

```java
Map<String, Long> countByCity = bookings.stream()
        .collect(Collectors.groupingBy(Booking::city, Collectors.counting()));

Map<String, Integer> revenueByCity = bookings.stream()
        .collect(Collectors.groupingBy(Booking::city, Collectors.summingInt(Booking::total)));

Map<String, Set<String>> hotelsByCity = bookings.stream()
        .collect(Collectors.groupingBy(
                Booking::city,
                TreeMap::new,
                Collectors.mapping(Booking::hotelName, Collectors.toSet())));
```

Two facts that cause most of the errors:

- A `null` key from the classifier throws `NullPointerException`. Clean the field or filter those
  rows out first.
- The result of the two argument form is a `HashMap`, so the group order is arbitrary. Add
  `TreeMap::new` when the report must be sorted by key, or sort the entries later.

Nested grouping works the same way: pass another `groupingBy` as the downstream collector.

```java
Map<String, Map<String, Long>> perCityPerHotel = bookings.stream()
        .collect(Collectors.groupingBy(
                Booking::city,
                Collectors.groupingBy(Booking::hotelName, Collectors.counting())));
```

### Summing, averaging, statistics

For a single number, a primitive stream is the shortest path:

```java
int total = bookings.stream().mapToInt(Booking::total).sum();
double avgNights = bookings.stream().mapToInt(Booking::nights).average().orElse(0);
```

`average()` returns `OptionalDouble` because an empty stream has no average, while `sum()` returns
0 for an empty stream. That difference matters when the exam expects "n/a" instead of zero.

`summaryStatistics()` computes count, sum, min, max, and average in one pass:

```java
IntSummaryStatistics stats = bookings.stream()
        .mapToInt(Booking::nights)
        .summaryStatistics();
System.out.println(stats.getCount());
System.out.println(stats.getSum());
System.out.println(stats.getMin());
System.out.println(stats.getMax());
System.out.printf("%.2f%n", stats.getAverage());
```

Inside `collect`, the equivalents are `counting`, `summingInt`, `summingLong`, `summingDouble`,
`averagingInt`, `averagingLong`, `averagingDouble`, and `summarizingInt`. Use them when the values
are already grouped and `mapToInt` is no longer reachable.

`reduce` covers the rest. For strings, start with an identity and join with a separator:

```java
String all = bookings.stream()
        .map(Booking::guestName)
        .reduce("", (left, right) -> left.isEmpty() ? right : left + ", " + right);
```

That works but `Collectors.joining` is clearer and does not copy the growing string on every step.
`StringBuilder` or `String.join` is the other readable option.

### Optional

`Optional<T>` is a box that either holds a value or nothing. Stream terminals such as `max`,
`findFirst`, and `average` return it because the answer may not exist. The point is to make the
empty case visible in the type instead of hiding it in a `null`.

```java
Optional<Booking> longest = bookings.stream()
        .max(Comparator.comparingInt(Booking::nights));

String label = longest
        .map(b -> b.hotelName() + " (" + b.nights() + " nights)")
        .orElse("no bookings");
```

The methods that matter:

- `Optional.of(value)` for a known non null value, `Optional.ofNullable(value)` for a maybe null
  one, and `Optional.empty()` for nothing.
- `map` transforms the value when present and keeps the empty case.
- `flatMap` does the same when the function already returns an `Optional`.
- `filter` turns a present value into an empty one when the predicate fails.
- `orElse(fallback)` returns the fallback, but the fallback expression is evaluated either way.
- `orElseGet(supplier)` evaluates the fallback only when needed. Use it for anything expensive,
  such as a database call.
- `orElseThrow()` throws `NoSuchElementException`, and `orElseThrow(Supplier)` throws your own
  exception.
- `ifPresent(consumer)` and `ifPresentOrElse(consumer, runnable)` run code only when present.
- `isPresent()` and `isEmpty()` are the plain checks.
- `stream()` turns an `Optional` into a stream of zero or one element, useful inside `flatMap`.

```java
int nights = bookings.stream()
        .filter(b -> b.city().equals("Budapest"))
        .findFirst()
        .map(Booking::nights)
        .orElse(0);
```

Avoid `get()` unless you just checked `isPresent()`, and avoid `Optional` as a field type or a
method parameter. It was designed for return values.

### Numeric streams

`IntStream`, `LongStream`, and `DoubleStream` hold primitives, so a pipeline over a million
numbers does not create a million `Integer` objects. They also add `sum`, `average`, `min`, `max`,
`summaryStatistics`, and `boxed()` to go back to a stream of objects.

```java
int[] nights = bookings.stream().mapToInt(Booking::nights).toArray();
List<Integer> boxed = IntStream.rangeClosed(1, 3).boxed().toList();
```

### Order and parallelism in one line each

Streams keep encounter order unless you call `unordered()` or use a parallel stream with an
operation that ignores order. Parallel streams split the work across threads, help only on large
CPU bound data, and break immediately if the lambda writes to a shared `ArrayList`. Skip them in
exam code unless the task asks for them.

## Examples

### Example 1: filter, map, collect into a report line

```java
import java.util.List;
import java.util.stream.Collectors;

public class FirstPipeline {

    record Booking(String guestName, String city, int nights) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Anna", "Budapest", 3),
                new Booking("Bela", "Vienna", 1),
                new Booking("Csilla", "Budapest", 5),
                new Booking("Dora", "Praha", 2));

        // Data shape: List<Booking> in, String out
        String line = bookings.stream()
                .filter(b -> b.nights() >= 2)          // keep longer stays
                .map(Booking::guestName)               // row to name
                .sorted()                              // alphabetical
                .collect(Collectors.joining(", "));

        System.out.println("Long stays: " + line);

        // A second pipeline is needed because a stream is consumed once.
        List<String> cities = bookings.stream()
                .map(Booking::city)
                .distinct()
                .toList();

        System.out.println("Cities: " + cities);
        System.out.println("Rows unchanged: " + bookings.size());
    }
}
```

`distinct` needs `equals`, which `String` has. The original list still holds four rows, a useful
line to print when you are unsure whether a stream modified the source.

### Example 2: grouping and summing

```java
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Grouping {

    record Booking(String city, String hotelName, int nights, int pricePerNight) {
        int total() {
            return nights * pricePerNight;
        }
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", "Danube View", 3, 80),
                new Booking("Vienna", "Alpen Hof", 4, 95),
                new Booking("Budapest", "City Inn", 1, 60),
                new Booking("Praha", "City Inn", 2, 60),
                new Booking("Budapest", "Danube View", 5, 80));

        // Data shape: Map<String, Long>, city to count, sorted keys
        Map<String, Long> countByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.counting()));

        // Data shape: Map<String, Integer>, city to revenue, sorted keys
        Map<String, Integer> revenueByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.summingInt(Booking::total)));

        System.out.println("Bookings: " + countByCity);
        System.out.println("Revenue:  " + revenueByCity);

        // A downstream collector can build a set instead of a list.
        Map<String, java.util.Set<String>> hotelsByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        Collectors.mapping(Booking::hotelName, Collectors.toSet())));
        System.out.println("Hotels:   " + hotelsByCity);
    }
}
```

The `TreeMap::new` argument is what makes the printed map sorted. Without it the groups appear in
hash order and the output changes between runs.

### Example 3: toMap with a merge, Optional for the maximum

```java
import java.util.Comparator;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Totals {

    record Booking(String hotelName, String city, int nights, int pricePerNight) {
        int total() {
            return nights * pricePerNight;
        }
    }

    public static void main(String[] args) {
        var bookings = java.util.List.of(
                new Booking("Danube View", "Budapest", 3, 80),
                new Booking("Alpen Hof", "Vienna", 4, 95),
                new Booking("Danube View", "Budapest", 1, 80),
                new Booking("City Inn", "Praha", 2, 60));

        // Data shape: Map<String, Integer>, hotel to revenue, duplicates added
        Map<String, Integer> revenue = bookings.stream()
                .collect(Collectors.toMap(
                        Booking::hotelName,
                        Booking::total,
                        Integer::sum,
                        TreeMap::new));

        // Data shape: Optional<Booking>, empty when the list is empty
        Optional<Booking> best = bookings.stream()
                .max(Comparator.comparingInt(Booking::total));

        System.out.println("Revenue: " + revenue);
        System.out.println("Best: " + best
                .map(b -> b.hotelName() + " = " + b.total())
                .orElse("no bookings"));

        int all = bookings.stream().mapToInt(Booking::total).sum();
        System.out.println("All revenue: " + all);
    }
}
```

The merge function is the difference between a working report and a crash. `max` returns an
`Optional`, and `map` plus `orElse` turns it into a printable string without a null check.

### Example 4: booking report, one program with the whole toolbox

```java
import java.util.Comparator;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * BookingReport reads a fixed list of bookings and prints a full report.
 *
 * Run:
 *   javac BookingReport.java
 *   java BookingReport
 *
 * The rows below stand in for a CSV file. Every block is one exam style task.
 */
public class BookingReport {

    /** One booking. guests holds every name on the reservation. */
    record Booking(
            String customerEmail,
            String city,
            String hotelName,
            int nights,
            int pricePerNight,
            boolean breakfast,
            List<String> guests) {

        int total() {
            return nights * pricePerNight + (breakfast ? nights * 12 : 0);
        }

        String guestLabel() {
            return String.join(" + ", guests);
        }
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("anna@example.com", "Budapest", "Danube View", 3, 80, true,
                        List.of("Anna", "Peter")),
                new Booking("bela@example.com", "Vienna", "Alpen Hof", 4, 95, false,
                        List.of("Bela")),
                new Booking("anna@example.com", "Budapest", "City Inn", 1, 60, false,
                        List.of("Anna")),
                new Booking("csilla@example.com", "Praha", "City Inn", 2, 60, true,
                        List.of("Csilla", "Gabor", "Marta")),
                new Booking("dora@example.com", "Budapest", "Danube View", 5, 80, false,
                        List.of("Dora")));

        // 1. Count and total. Two terminals, so two pipelines.
        long rows = bookings.size();
        int revenue = bookings.stream().mapToInt(Booking::total).sum();
        System.out.println("Rows: " + rows + ", revenue: " + revenue);

        // 2. Filter, map, distinct, sorted, join.
        String cities = bookings.stream()
                .filter(b -> b.nights() >= 2)
                .map(Booking::city)
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));
        System.out.println("Cities with a stay of 2+ nights: " + cities);

        // 3. flatMap: every guest name from every reservation, once.
        String everyone = bookings.stream()
                .flatMap(b -> b.guests().stream())
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));
        System.out.println("All guests: " + everyone);

        // 4. Group by city, count and sum in one pass each.
        Map<String, Long> countByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.counting()));
        Map<String, Integer> revenueByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.summingInt(Booking::total)));
        System.out.println("\nBy city:");
        countByCity.forEach((city, count) ->
                System.out.printf("  %-9s %d booking(s), %d total%n",
                        city, count, revenueByCity.get(city)));

        // 5. Two level grouping: city, then hotel, then count.
        Map<String, Map<String, Long>> perCityPerHotel = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.groupingBy(
                                Booking::hotelName,
                                TreeMap::new,
                                Collectors.counting())));
        System.out.println("\nCity then hotel: " + perCityPerHotel);

        // 6. Hotel revenue with a merge function, sorted keys.
        Map<String, Integer> revenueByHotel = bookings.stream()
                .collect(Collectors.toMap(
                        Booking::hotelName,
                        Booking::total,
                        Integer::sum,
                        TreeMap::new));
        System.out.println("\nHotel revenue: " + revenueByHotel);

        // 7. Optional maximum, formatted without a null check.
        Optional<Booking> best = bookings.stream()
                .max(Comparator.comparingInt(Booking::total));
        System.out.println("Best booking: " + best
                .map(b -> b.guestLabel() + " at " + b.hotelName() + " = " + b.total())
                .orElse("none"));

        // 8. Statistics over the nights and the totals.
        IntSummaryStatistics nightStats = bookings.stream()
                .mapToInt(Booking::nights)
                .summaryStatistics();
        System.out.printf("%nNights: count=%d sum=%d min=%d max=%d avg=%.2f%n",
                nightStats.getCount(),
                nightStats.getSum(),
                nightStats.getMin(),
                nightStats.getMax(),
                nightStats.getAverage());

        double averageTotal = bookings.stream()
                .mapToInt(Booking::total)
                .average()
                .orElse(0);
        System.out.printf("Average booking value: %.2f%n", averageTotal);

        // 9. Partition: breakfast or not. The map always has both keys.
        Map<Boolean, List<Booking>> byBreakfast = bookings.stream()
                .collect(Collectors.partitioningBy(Booking::breakfast));
        System.out.println("With breakfast: " + byBreakfast.get(true).size());
        System.out.println("Without: " + byBreakfast.get(false).size());

        // 10. A sorted top list: comparator, limit, collect.
        List<String> top = bookings.stream()
                .sorted(Comparator.comparingInt(Booking::total).reversed())
                .limit(3)
                .map(b -> b.hotelName() + " (" + b.total() + ")")
                .toList();
        System.out.println("Top 3: " + top);

        // 11. Boolean questions stop at the first decisive row.
        boolean anyLong = bookings.stream().anyMatch(b -> b.nights() > 4);
        boolean allPaid = bookings.stream().allMatch(b -> b.total() > 0);
        boolean noEmptyCity = bookings.stream().noneMatch(b -> b.city().isBlank());
        System.out.println("Any stay over 4 nights: " + anyLong);
        System.out.println("All bookings have a price: " + allPaid);
        System.out.println("No blank city: " + noEmptyCity);

        // 12. Unique guests per city, sorted, as a set.
        Map<String, Set<String>> guestsByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        Collectors.flatMapping(
                                b -> b.guests().stream(),
                                Collectors.toSet())));
        System.out.println("Guest names by city: " + guestsByCity);
    }
}
```

Each numbered block is a separate pipeline, because each one needs its own terminal operation.
The data never changes, so the report can run any number of queries over the same list.

## Common mistakes

- Forgetting the terminal operation. `bookings.stream().filter(...)` on its own does nothing.
- Reusing a stream variable for a second query. Build a new stream from the list each time.
- Calling `toList()` and then `add`. The result is unmodifiable. Use
  `collect(Collectors.toCollection(ArrayList::new))` when you need to change it.
- Using `Collectors.toMap` without a merge function. A duplicate key throws
  `IllegalStateException: Duplicate key`.
- Letting `groupingBy` see a `null` key. It throws `NullPointerException`. Filter or default the
  field first.
- Expecting `groupingBy` output to be sorted. It is a `HashMap` unless you pass a map factory.
- Using `map` when the function returns a collection and you wanted the elements. That is
  `flatMap`.
- Calling `get()` on an `Optional` without a check. Use `orElse`, `orElseGet`, or `map`.
- Using `orElse(expensiveCall())` in a hot path. The argument is built even when the value is
  present, so use `orElseGet`.
- Putting real work in `peek`. It is meant for debugging and may not run at all if the terminal
  operation short circuits.
- Sorting before filtering. Filter first, then sort what is left, or combine both in one
  comparator.
- Using `==` to compare strings inside a lambda. Use `equals`.
- Modifying the source list inside `forEach`. Collect a new list instead, or the result depends on
  iteration order.
- Assuming `average()` returns a number. It returns `OptionalDouble`, and `sum()` on an empty
  primitive stream is 0, not empty.
- Using a parallel stream with a shared `ArrayList` and `forEach(list::add)`. The list is not
  thread safe and rows are lost or the program throws.

## Exam checklist

1. Can you name the three pipeline parts and say which operations are lazy?
2. Can you write `filter`, `map`, `sorted`, and `collect` in one chain without looking?
3. Can you build a comma separated line with `Collectors.joining` and no trailing comma?
4. Can you group by one field and count, then group by city and sum a numeric field?
5. Can you explain why `toMap` needs a merge function and what happens without it?
6. Can you write a two level `groupingBy` and read the result type out loud?
7. Can you compute count, sum, min, max, and average in one pass?
8. Can you use `Optional` from `max` through `map` to `orElse` without a null check?
9. Can you choose between `map` and `flatMap` for a field that holds a list?
10. Can you list four stream mistakes you have already made in practice?
