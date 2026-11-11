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

## More examples

Six programs follow. Each one is a complete class you can paste into a file, compile with `javac`, and run. They cover the operations exam tasks combine most often, and each prints something so a wrong result is visible.

### Example 5: flatMap over nested lists

A booking often carries a list, such as the guests on the reservation. `map` would give you a stream of lists; `flatMap` opens each list and continues with the elements.

```java
// File: GuestRollup.java
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * flatMap is the operation for a column that holds a list.
 * One booking becomes many guest names, and the pipeline continues with plain strings.
 */
public class GuestRollup {

    // Data shape: List<Booking>, each row owns two nested lists.
    record Booking(String city, String hotelName, List<String> guests, List<String> extras) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", "Danube View", List.of("Anna", "Peter"),
                        List.of("spa", "parking")),
                new Booking("Vienna", "Alpen Hof", List.of("Bela"),
                        List.of("breakfast")),
                new Booking("Budapest", "City Inn", List.of("Csilla", "Gabor", "Marta"),
                        List.of("parking")),
                new Booking("Praha", "City Inn", List.of("Dora"),
                        List.of()));

        // Data shape: Stream<String> for a while, then one String.
        // The inner stream is opened by flatMap and glued to the outer one, so
        // distinct sees guest names from every booking, not one list per booking.
        String guests = bookings.stream()
                .flatMap(b -> b.guests().stream())
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));
        System.out.println("Guests: " + guests);

        // Two nested lists from the same row can become one stream of labels.
        // Stream.concat takes two streams of the same type; here both are Stream<String>.
        List<String> labels = bookings.stream()
                .flatMap(b -> Stream.concat(
                        b.guests().stream().map(g -> g + " @" + b.hotelName()),
                        b.extras().stream().map(e -> e + " @" + b.hotelName())))
                .limit(4)
                .toList();
        System.out.println("First four labels: " + labels);

        // Data shape: Map<String, Set<String>>, city to guest names with duplicates gone.
        // flatMapping is the collector version of flatMap; it runs inside each group.
        Map<String, Set<String>> guestsByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.flatMapping(b -> b.guests().stream(), Collectors.toSet())));
        System.out.println("Guests by city: " + guestsByCity);

        // Data shape: Map<String, Long>, extra service to how many bookings asked for it.
        // groupingBy with a key mapper that returns the element itself counts occurrences.
        Map<String, Long> extrasDemand = bookings.stream()
                .flatMap(b -> b.extras().stream())
                .collect(Collectors.groupingBy(e -> e, TreeMap::new, Collectors.counting()));
        System.out.println("Extras demand: " + extrasDemand);

        // A booking with no extras contributes zero elements after flatMap, not a null.
        // This is why flatMap is safer than map when the inner list may be empty.
        long rowsWithExtras = bookings.stream()
                .filter(b -> !b.extras().isEmpty())
                .count();
        System.out.println("Bookings with extras: " + rowsWithExtras);
    }
}
```

The output shows why the operation earns its place:

```text
Guests: Anna, Bela, Csilla, Dora, Gabor, Marta, Peter
First four labels: [Anna @Danube View, Peter @Danube View, spa @Danube View, parking @Danube View]
Guests by city: {Budapest=[Marta, Csilla, Peter, Gabor, Anna], Praha=[Dora], Vienna=[Bela]}
Extras demand: {breakfast=1, parking=2, spa=1}
Bookings with extras: 3
```

`flatMap` accepts anything that returns a `Stream`, and `map` inside it is how you attach the parent row to each child. `Collectors.flatMapping` does the same job after `groupingBy` has already fixed the keys, which is the only place a plain `flatMap` cannot help.

### Example 6: partitioningBy keeps both keys

`partitioningBy` splits on a boolean. Unlike `groupingBy`, it always returns two entries, so a lookup of an empty half returns an empty list instead of null.

```java
// File: StaySplit.java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * partitioningBy is groupingBy with exactly two fixed keys, true and false.
 * The map always contains both keys, even when one side is empty.
 */
public class StaySplit {

    // Data shape: List<Booking>, four fields used by four different downstreams.
    record Booking(String city, int nights, int total, boolean breakfast) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", 3, 276, true),
                new Booking("Vienna", 4, 380, false),
                new Booking("Budapest", 1, 60, false),
                new Booking("Praha", 2, 144, true),
                new Booking("Budapest", 5, 400, false));

        // Data shape: Map<Boolean, List<Booking>>. Both halves always exist.
        Map<Boolean, List<Booking>> byBreakfast = bookings.stream()
                .collect(Collectors.partitioningBy(Booking::breakfast));
        System.out.println("With breakfast: " + byBreakfast.get(true).size());
        System.out.println("Without: " + byBreakfast.get(false).size());

        // Data shape: Map<Boolean, Long>. The downstream replaces the list with a number.
        Map<Boolean, Long> countByBreakfast = bookings.stream()
                .collect(Collectors.partitioningBy(Booking::breakfast, Collectors.counting()));

        // Data shape: Map<Boolean, Double>.
        // averagingInt returns 0.0 for an empty half, while groupingBy would drop the key.
        Map<Boolean, Double> averageByBreakfast = bookings.stream()
                .collect(Collectors.partitioningBy(
                        Booking::breakfast,
                        Collectors.averagingInt(Booking::total)));

        System.out.println("Counts: " + countByBreakfast);
        System.out.printf("Average value, breakfast=%s, no breakfast=%s%n",
                averageByBreakfast.get(true), averageByBreakfast.get(false));

        // filtering is the collector form of filter. It runs inside the downstream,
        // so it still works after a groupingBy or partitioningBy has decided the keys,
        // where a plain filter on the stream would come too late.
        Map<Boolean, Integer> longStayRevenue = bookings.stream()
                .collect(Collectors.partitioningBy(
                        Booking::breakfast,
                        Collectors.filtering(b -> b.nights() >= 3, Collectors.summingInt(Booking::total))));
        System.out.println("Revenue from stays of 3+ nights: " + longStayRevenue);

        // groupingBy over the same rows keeps every key that occurs, sorted here.
        // Compare the output shapes: groupingBy may omit a key, partitioningBy cannot.
        Map<String, Long> byCity = bookings.stream()
                .collect(Collectors.groupingBy(Booking::city, Collectors.counting()));
        System.out.println("By city: " + byCity);
    }
}
```

```text
With breakfast: 2
Without: 3
Counts: {false=3, true=2}
Average value, breakfast=210.0, no breakfast=280.0
Revenue from stays of 3+ nights: {false=780, true=276}
By city: {Budapest=3, Praha=1, Vienna=1}
```

The empty side question is the one worth memorising. A partition with `counting()` reports `0` for a side with no rows, and `averagingInt` reports `0.0`. `groupingBy` would produce a map without that key at all, and `map.get(key)` would then hand you a null that crashes the next line. When the exam asks for "both answers, even when one is zero", `partitioningBy` is the shorter path.

### Example 7: toMap with a merge, and reduce as the fallback fold

Three folds in one program: `toMap` when the result is a map, `reduce` when it is a single value, and `reduce` without an identity when an empty input must stay visible.

```java
// File: Ledger.java
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;

/**
 * Three ways to fold a list into one value: toMap with a merge function,
 * reduce with an identity, and reduce without one.
 */
public class Ledger {

    // Data shape: List<Move>. amount may be negative, so a plain sum is not a total revenue.
    record Move(String hotelName, String city, int amount, String note) {
    }

    public static void main(String[] args) {
        List<Move> moves = List.of(
                new Move("Danube View", "Budapest", 240, "3 nights"),
                new Move("Alpen Hof", "Vienna", 380, "4 nights"),
                new Move("Danube View", "Budapest", -80, "refund"),
                new Move("City Inn", "Praha", 120, "2 nights"),
                new Move("Danube View", "Budapest", 160, "2 nights"));

        // Data shape: Map<String, Integer>, hotel to net amount, keys sorted.
        // The third argument is the merge function: two rows with the same key are
        // combined with Integer::sum instead of throwing IllegalStateException.
        Map<String, Integer> netByHotel = moves.stream()
                .collect(Collectors.toMap(
                        Move::hotelName,
                        Move::amount,
                        Integer::sum,
                        TreeMap::new));
        System.out.println("Net by hotel: " + netByHotel);

        // The merge function can express a rule instead of an addition.
        // maxBy keeps the larger of the two amounts when a key repeats.
        Map<String, Integer> largestByHotel = moves.stream()
                .collect(Collectors.toMap(
                        Move::hotelName,
                        Move::amount,
                        BinaryOperator.maxBy(Integer::compare)));   // HashMap, unordered
        System.out.println("Largest single move: " + largestByHotel);

        // A merge function can build a second value shape, here a joined note column.
        Map<String, String> notesByHotel = moves.stream()
                .collect(Collectors.toMap(
                        Move::hotelName,
                        Move::note,
                        (left, right) -> left + " | " + right,
                        TreeMap::new));
        System.out.println("Notes: " + notesByHotel);

        // Baseline: a primitive sum, no boxing at any step.
        int summed = moves.stream().mapToInt(Move::amount).sum();

        // reduce with an identity returns the identity type, never Optional.
        // For a sum the two forms agree; for a fold into another type only reduce works.
        int folded = moves.stream().map(Move::amount).reduce(0, Integer::sum);
        System.out.println("Sum " + summed + " equals fold " + folded);

        // reduce without an identity returns Optional, because an empty stream has no answer.
        // Integer::max is a BinaryOperator<Integer>, exactly what reduce expects.
        Optional<Integer> biggest = moves.stream().map(Move::amount).reduce(Integer::max);
        System.out.println("Biggest move: " + biggest.orElse(0));

        // Fold into a different type: the accumulator is a String, the element is a Move.
        // The identity is "" and the first step avoids a leading arrow.
        String trail = moves.stream()
                .map(m -> m.hotelName() + ":" + m.amount())
                .reduce("", (acc, s) -> acc.isEmpty() ? s : acc + " -> " + s);
        System.out.println("Trail: " + trail);

        // The three argument reduce adds a combiner. Sequential streams never call it,
        // but a parallel stream combines partial results with it, so it must agree
        // with the accumulator.
        int absolute = moves.stream()
                .reduce(0, (acc, m) -> acc + Math.abs(m.amount()), Integer::sum);
        System.out.println("Absolute volume: " + absolute);
    }
}
```

```text
Net by hotel: {Alpen Hof=380, City Inn=120, Danube View=320}
Largest single move: {Danube View=240, City Inn=120, Alpen Hof=380}
Notes: {Alpen Hof=4 nights, City Inn=2 nights, Danube View=3 nights | refund | 2 nights}
Sum 820 equals fold 820
Biggest move: 380
Trail: Danube View:240 -> Alpen Hof:380 -> Danube View:-80 -> City Inn:120 -> Danube View:160
Absolute volume: 980
```

Read the first and second map together. The merge function decides the whole meaning of the result: `Integer::sum` nets a refund against a charge, `maxBy` reports the largest single movement. Both are correct, and the exam question decides which one is wanted. The `toMap` call without a merge function cannot express either, and it throws on the second row for the same key.

The last line is a warning about the three argument `reduce`. It exists for parallel streams, where partial results are combined by the third function. If the combiner disagrees with the accumulator, a sequential run looks right and a parallel run does not.

### Example 8: Optional through a whole lookup

A lookup that can miss deserves a return type that says so. Start with `findFirst`, keep the value in the box, and open it exactly once at the end.

```java
// File: FirstMatch.java
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Optional at every step of a lookup: find, transform, filter, and decide what
 * an empty result means. No null check appears anywhere in main.
 */
public class FirstMatch {

    // Data shape: List<Hotel>. phone is a nullable column, as a database or CSV gives it.
    record Hotel(String name, String city, int stars, String phone) {
    }

    // Returning Optional makes the miss part of the signature instead of a null.
    static Optional<Hotel> findHotel(List<Hotel> hotels, String city) {
        return hotels.stream()
                .filter(h -> h.city().equalsIgnoreCase(city))
                .findFirst();
    }

    // ofNullable is the bridge from a nullable field to Optional.
    static Optional<String> phoneOf(Hotel hotel) {
        return Optional.ofNullable(hotel.phone());
    }

    public static void main(String[] args) {
        List<Hotel> hotels = List.of(
                new Hotel("Danube View", "Budapest", 4, " +36 1 555 0100 "),
                new Hotel("City Inn", "Praha", 3, null),
                new Hotel("Alpen Hof", "Vienna", 5, "+43 1 555 0200"));

        // Data shape: Optional<String>. Each step keeps the empty case alive.
        // flatMap is used because phoneOf already returns an Optional.
        String phone = findHotel(hotels, "Praha")
                .flatMap(FirstMatch::phoneOf)
                .map(String::trim)
                .filter(p -> !p.isEmpty())
                .orElse("no phone on file");
        System.out.println("Praha phone: " + phone);

        // orElseGet runs the supplier only when the Optional is empty.
        String vienna = findHotel(hotels, "Vienna")
                .map(Hotel::name)
                .orElseGet(() -> {
                    System.out.println("  (fallback computed)");
                    return "unknown hotel";
                });
        System.out.println("Vienna: " + vienna);

        // orElseThrow with a supplier gives the caller a domain error, not a null.
        Hotel fiveStar = findHotel(hotels, "Vienna")
                .filter(h -> h.stars() >= 5)
                .orElseThrow(() -> new IllegalStateException("no five star hotel in Vienna"));
        System.out.println("Five star: " + fiveStar.name());

        // Optional.stream() turns a value into zero or one element.
        // Chained after map(Optional::ofNullable) it removes the null phones from the pipeline.
        String phones = hotels.stream()
                .map(Hotel::phone)
                .map(Optional::ofNullable)
                .flatMap(Optional::stream)
                .map(String::trim)
                .collect(Collectors.joining(", "));
        System.out.println("Phones: " + phones);

        // ifPresentOrElse covers both branches without an if statement.
        findHotel(hotels, "Praha").ifPresentOrElse(
                h -> System.out.println("Found " + h.name() + " (" + h.stars() + " stars)"),
                () -> System.out.println("No hotel in Praha"));
    }
}
```

```text
Praha phone: no phone on file
Vienna: Alpen Hof
Five star: Alpen Hof
Phones: +36 1 555 0100, +43 1 555 0200
Found City Inn (3 stars)
```

The Praha row reaches `map`, `filter`, and `orElse` as an empty box. No step needs a null guard, and the fallback text is produced once, at the end. Replace `orElse("no phone on file")` with `get()` and the same input throws `NoSuchElementException`.

`map(Optional::ofNullable)` followed by `flatMap(Optional::stream)` is a useful pair. It filters out null values while keeping the pipeline one flat stream, which is exactly the shape `joining` needs.

### Example 9: parallel streams, and the one way they break

A parallel stream is the same pipeline with the source cut into chunks. The answers are identical when the operations are stateless and associative. Sharing one mutable collection between the chunks is what turns a report into a lost row.

```java
// File: ParallelSum.java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * A parallel stream is the same pipeline with the source split across threads.
 * It pays only for large CPU bound work, and it breaks the moment a lambda
 * writes into a shared collection.
 */
public class ParallelSum {

    // Data shape: List<Booking>, about 200k rows so the split has something to do.
    record Booking(String city, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = new ArrayList<>();
        for (int i = 0; i < 200_000; i++) {
            bookings.add(new Booking(i % 3 == 0 ? "Budapest" : "Vienna", (i % 50) + 10));
        }

        // Addition is associative, so split and combine gives the same number.
        // A non associative fold, such as string concatenation with a separator,
        // can change the order of the parts and must not be parallelized blindly.
        int sequential = bookings.stream().mapToInt(Booking::total).sum();
        int parallel = bookings.parallelStream().mapToInt(Booking::total).sum();
        System.out.println("Sequential " + sequential + ", parallel " + parallel);

        // collect keeps one partial container per thread and merges at the end,
        // so the result is correct for both streams.
        Map<String, Integer> revenue = bookings.parallelStream()
                .collect(Collectors.groupingBy(Booking::city, Collectors.summingInt(Booking::total)));
        System.out.println("Revenue: " + revenue);

        // The broken version, kept as a comment because it is the exam question.
        // ArrayList is not thread safe; several threads call add at once and rows vanish.
        //
        // List<Integer> shared = new ArrayList<>();
        // bookings.parallelStream().forEach(b -> shared.add(b.total()));
        //
        // The fix is to let collect do the merging.
        List<Integer> safe = bookings.parallelStream()
                .map(Booking::total)
                .collect(Collectors.toList());
        System.out.println("Collected rows: " + safe.size());

        // forEach on a parallel stream does not promise order. forEachOrdered does,
        // at the cost of a synchronization step.
        // findFirst keeps encounter order; findAny is free to return any match.
        int firstBig = bookings.parallelStream()
                .filter(b -> b.total() >= 59)
                .mapToInt(Booking::total)
                .findFirst()
                .orElse(-1);
        System.out.println("First big total: " + firstBig);

        // IntStream.rangeClosed splits cleanly by index, which makes it a good
        // parallel source for numeric work.
        long primes = IntStream.rangeClosed(2, 200_000).parallel()
                .filter(ParallelSum::isPrime)
                .count();
        System.out.println("Primes below 200000: " + primes);
    }

    // Trial division up to the square root is enough to decide primality.
    static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
    }
}
```

```text
Sequential 6900000, parallel 6900000
Revenue: {Budapest=2300003, Vienna=4599997}
Collected rows: 200000
First big total: 59
Primes below 200000: 17984
```

The two sums agree because integer addition does not care about the order of the parts. Sorting does care, and a parallel `sorted` with a comparator pays a merge cost at the end, so a parallel stream can be slower than a sequential one on a small list. Measure, or skip it, which is the answer most exams want anyway.

The `shared.add` line in the comment is the classic failure. Nothing warns you: the list is shorter than the row count, or the program throws a bounds error from a resize race. `collect` is the safe ending because each thread owns a private container until the merge.

### Example 10: a report built from independent pipelines

A real exam task is several questions over one list. Keeping each answer in its own pipeline makes the program readable and the output repeatable.

```java
// File: BookingBoard.java
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalDouble;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * A report is a set of independent pipelines over one unchanged list.
 * report() returns lines instead of printing, so the same data can feed a
 * console, a file, or a test with no change to the queries.
 */
public class BookingBoard {

    // Data shape: List<Booking>. nights and pricePerNight build the money fields,
    // guests counts adults plus children, breakfast is the partition key.
    record Booking(
            String customerEmail,
            String city,
            String hotelName,
            int nights,
            int pricePerNight,
            int adults,
            int children,
            boolean breakfast) {

        int total() {
            return nights * pricePerNight + (breakfast ? nights * 12 : 0);
        }

        int guests() {
            return adults + children;
        }
    }

    static List<String> report(List<Booking> bookings) {
        // Data shape: List<String>, one line per printed row.
        List<String> out = new java.util.ArrayList<>();
        out.add("BOOKING BOARD");
        out.add("rows=" + bookings.size());

        // 1. Header numbers in one pass each. summaryStatistics needs an int stream,
        //    so mapToInt comes before it.
        var totals = bookings.stream().mapToInt(Booking::total).summaryStatistics();
        out.add(String.format("revenue=%d avg=%.1f min=%d max=%d",
                totals.getSum(), totals.getAverage(), totals.getMin(), totals.getMax()));

        // 2. Revenue by city, sorted by value descending, then by key to break ties.
        //    The entrySet stream is the only way to sort a map by its values.
        Map<String, Integer> revenueByCity = bookings.stream()
                .collect(Collectors.groupingBy(Booking::city, Collectors.summingInt(Booking::total)));
        out.add("revenue by city:");
        revenueByCity.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .forEach(e -> out.add(String.format("  %-9s %6d", e.getKey(), e.getValue())));

        // 3. Top hotels by nights sold. Sorting before limit is required: limit
        //    alone keeps whatever order the source had.
        List<String> topHotels = bookings.stream()
                .collect(Collectors.groupingBy(Booking::hotelName, Collectors.summingInt(Booking::nights)))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(3)
                .map(e -> e.getKey() + " (" + e.getValue() + " nights)")
                .toList();
        out.add("top hotels: " + topHotels);

        // 4. Average stay per city. averagingInt returns Double, so an absent key
        //    prints as a missing row rather than 0.
        Map<String, Double> avgNightsByCity = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::city,
                        TreeMap::new,
                        Collectors.averagingInt(Booking::nights)));
        StringBuilder avgLine = new StringBuilder("average nights:");
        avgNightsByCity.forEach((city, avg) -> avgLine.append(' ').append(city).append('=')
                .append(String.format("%.2f", avg)));
        out.add(avgLine.toString());

        // 5. Guests per city, counting every person on every reservation.
        Map<String, Integer> guestsByCity = bookings.stream()
                .collect(Collectors.groupingBy(Booking::city, Collectors.summingInt(Booking::guests)));
        out.add("guests by city: " + new TreeMap<>(guestsByCity));

        // 6. Partition on breakfast. Both keys exist, so both counts can print.
        Map<Boolean, Long> breakfast = bookings.stream()
                .collect(Collectors.partitioningBy(Booking::breakfast, Collectors.counting()));
        out.add("breakfast yes=" + breakfast.get(true) + " no=" + breakfast.get(false));

        // 7. A repeated customer: group by email, keep the groups with two or more rows.
        List<String> repeat = bookings.stream()
                .collect(Collectors.groupingBy(Booking::customerEmail, Collectors.counting()))
                .entrySet().stream()
                .filter(e -> e.getValue() >= 2)
                .map(Map.Entry::getKey)
                .sorted()
                .toList();
        out.add("repeat customers: " + (repeat.isEmpty() ? "none" : repeat));

        // 8. Extremes as Optional, printed without a null check.
        Optional<Booking> dearest = bookings.stream()
                .max(Comparator.comparingInt(Booking::total));
        Optional<Booking> cheapest = bookings.stream()
                .min(Comparator.comparingInt(Booking::total));
        out.add("dearest: " + dearest
                .map(b -> b.hotelName() + " = " + b.total())
                .orElse("none"));
        out.add("cheapest: " + cheapest
                .map(b -> b.hotelName() + " = " + b.total())
                .orElse("none"));

        // 9. A percentage guard. average() is OptionalDouble, so an empty list
        //    is a visible case, not a division by zero.
        OptionalDouble averageGuests = bookings.stream()
                .mapToInt(Booking::guests)
                .average();
        out.add(averageGuests.isPresent()
                ? String.format("average party size: %.2f", averageGuests.getAsDouble())
                : "average party size: n/a");

        // 10. A boolean summary for the footer. anyMatch stops at the first hit.
        boolean longStay = bookings.stream().anyMatch(b -> b.nights() >= 5);
        boolean allPriced = bookings.stream().allMatch(b -> b.pricePerNight() > 0);
        out.add("long stay present=" + longStay + " all priced=" + allPriced);

        return out;
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("anna@example.com", "Budapest", "Danube View", 3, 80, 2, 0, true),
                new Booking("bela@example.com", "Vienna", "Alpen Hof", 4, 95, 1, 0, false),
                new Booking("anna@example.com", "Budapest", "City Inn", 1, 60, 1, 1, false),
                new Booking("csilla@example.com", "Praha", "City Inn", 2, 60, 2, 1, true),
                new Booking("dora@example.com", "Budapest", "Danube View", 5, 80, 1, 0, false));

        // Nothing above writes to the list, so the report can run again unchanged.
        report(bookings).forEach(System.out::println);
        System.out.println();
        System.out.println("Second run, same data:");
        report(bookings).forEach(System.out::println);
    }
}
```

```text
BOOKING BOARD
rows=5
revenue=1260 avg=252.0 min=60 max=400
revenue by city:
  Budapest     736
  Vienna       380
  Praha        144
top hotels: [Danube View (8 nights), Alpen Hof (4 nights), City Inn (3 nights)]
average nights: Budapest=3.00 Praha=2.00 Vienna=4.00
guests by city: {Budapest=5, Praha=3, Vienna=1}
breakfast yes=2 no=3
repeat customers: [anna@example.com]
dearest: Danube View = 400
cheapest: City Inn = 60
average party size: 1.80
long stay present=true all priced=true
```

The second run prints the same lines, which is the point of collecting into local variables instead of mutating the source. Two details carry most of the marks: the `entrySet().stream()` step that makes sorting a map by value possible, and the `groupingBy` plus `counting` plus `filter` chain that finds repeat customers in three short steps.

`report` returns `List<String>` rather than printing. That one decision makes the program testable and keeps `main` short. Sorting, grouping, and formatting stay in the method where the data is at hand.

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
