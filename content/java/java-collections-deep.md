---
id: java-collections-deep
lang: Java
title: Java collections
---

# Java collections

A booking file gives you rows. The exam asks for counts, groups, sorted reports, and
uniqueness checks. Almost every one of those answers is one collection method away, and picking
the wrong collection turns a clean loop into a slow or wrong program.

This page covers the classes you will actually type: `ArrayList`, `LinkedList`, `HashMap`,
`TreeMap`, `HashSet`, `TreeSet`, `Queue`, `Deque`, `Iterator`, and `Comparator`. It ends with a
full booking desk program that uses all of them in one place.

## Simplest form

```java
// Data shape: List<Booking>, one element per CSV row, index 0 is the first row
List<Booking> bookings = new ArrayList<>();
bookings.add(new Booking("anna@example.com", "Budapest", 3));
Booking first = bookings.get(0);
int rows = bookings.size();
```

That is the whole idea: a growable array behind a `List` interface. Everything else on this page
is a variation on the same question, which structure answers your lookup fastest.

## What it does

A collection stores many objects and gives you operations over them. The JDK splits them into
two families:

- `Collection<E>`: `List`, `Set`, and `Queue`. These hold elements. You can iterate them.
- `Map<K, V>`: holds key to value pairs. It is not a `Collection` and has no `iterator()`.

The interfaces describe behaviour. The classes decide cost. `List` promises order and index
access, but `ArrayList` and `LinkedList` deliver index access at very different prices. `Set`
promises no duplicates, but `HashSet` gets there with hashing and `TreeSet` with comparisons.
`Map` promises key lookup, and the same hash versus tree choice returns.

Four questions pick the class for you:

1. Do you need an index such as `get(0)`? Use `ArrayList`.
2. Do you need uniqueness? Use a `Set`, `HashSet` normally, `TreeSet` when order matters.
3. Do you need to find a value by key, such as a hotel name by id? Use a `Map`, `HashMap`
   normally, `TreeMap` when you want sorted keys or range queries.
4. Do you need to take from the front or the back? Use `ArrayDeque`.

If two answers apply, use two collections or one map of lists. That combination covers most exam
tasks without any clever code.

## Every part

### ArrayList

`ArrayList` wraps an `Object[]`. `get(i)` and `set(i, value)` are constant time because they
index the array. `add(value)` appends and is constant time on average. An insert or a remove in
the middle shifts every later element, so it costs time proportional to the list size.

The internal array starts at capacity 10 on the first add and grows by roughly half when full.
Growing copies the array, which is why a loop that knows the size should call
`new ArrayList<>(expectedSize)`.

```java
List<String> cities = new ArrayList<>();      // empty, mutable
cities.add("Budapest");
cities.add("Vienna");
cities.set(1, "Praha");                       // replace index 1
cities.remove("Budapest");                    // remove by value
cities.remove(0);                             // remove by index
```

`List.of(...)` returns an immutable list. It is the shortest way to seed data, but `add` on it
throws `UnsupportedOperationException`. Wrap it when you need to change the result:

```java
List<Booking> bookings = new ArrayList<>(List.of(first, second));
```

### LinkedList

`LinkedList` is a doubly linked chain of nodes. Adding or removing at either end is constant
time. `get(i)` walks from the nearer end, node by node, so it is linear. A loop with
`get(i)` inside is therefore quadratic, and that is the classic exam mistake with this class.

It also implements `Deque`, so it can serve as a queue or a stack. New code should prefer
`ArrayDeque` for that job: it uses one array, has no node objects, and is faster in practice.
`LinkedList` remains useful when you constantly insert in the middle through a `ListIterator`.

```java
LinkedList<Booking> waiting = new LinkedList<>();
waiting.addLast(booking);      // enqueue
Booking next = waiting.removeFirst();  // dequeue
```

### HashMap

`HashMap` stores entries in an array of buckets. On `put`, the key's `hashCode()` is spread and
reduced to a bucket index, then `equals` decides whether the key is already there. Average cost
for `put`, `get`, and `remove` is constant. A bad `hashCode` collapses buckets and the cost rises.

Since Java 8, a bucket that grows past eight entries converts to a small tree, which caps the
worst case near logarithmic time. That is an implementation detail, not something to rely on
when writing your own key class.

Facts worth remembering:

- One `null` key is allowed, and `null` values too.
- Default capacity is 16 and the load factor is 0.75. The table doubles when it gets full.
- Iteration order is not insertion order. It follows the hash and changes after a resize.
- It is not synchronized. `ConcurrentHashMap` is the thread safe cousin.

```java
Map<String, Integer> nightsByCity = new HashMap<>();
nightsByCity.put("Budapest", 12);
int nights = nightsByCity.get("Budapest");        // 12
int safe = nightsByCity.getOrDefault("Praha", 0); // 0 when missing
nightsByCity.merge("Praha", 5, Integer::sum);     // insert 5 or add to the old value
```

`computeIfAbsent` builds a map of lists without a null check, which is the shape you want when
grouping by hand:

```java
Map<String, List<Booking>> byCity = new HashMap<>();
for (Booking b : bookings) {
    byCity.computeIfAbsent(b.city(), key -> new ArrayList<>()).add(b);
}
```

### TreeMap

`TreeMap` is a red black tree. Keys stay sorted at all times, and `put`, `get`, and `remove` cost
logarithmic time. Sorting comes from the key's `compareTo`, or from a `Comparator` passed to the
constructor. Natural ordering rejects `null` keys with a `NullPointerException`, because there is
nothing to compare null with.

The navigable methods are the reason to choose it over a `HashMap` plus a sort:

```java
TreeMap<Integer, Long> byYear = new TreeMap<>();
byYear.put(2023, 41L);
byYear.put(2024, 57L);
int firstYear = byYear.firstKey();       // 2023
Map<Integer, Long> recent = byYear.tailMap(2024);  // view from 2024 up
```

`headMap`, `tailMap`, and `subMap` return views backed by the original map. Changing the view
changes the map. A report that prints years in order needs no sorting call at all when the data
already sits in a `TreeMap`.

### HashSet

`HashSet` is a `HashMap` where the value is a dummy constant. `add` returns `false` when the
element was already present, which makes duplicate detection a one liner:

```java
Set<String> emails = new HashSet<>();
boolean isNew = emails.add("anna@example.com");  // true
boolean again = emails.add("anna@example.com");  // false
```

There is no order and one `null` is allowed. The set depends on `equals` and `hashCode` of the
element class. A class that defines `equals` but not `hashCode` will happily store two objects
that look equal, and `contains` will miss them. A `record` generates both, so records are safe
keys and safe set elements.

Never change a field that participates in `hashCode` while the object is inside a `HashSet` or
used as a `HashMap` key. The entry stays in the old bucket and lookups stop finding it.

### TreeSet

`TreeSet` is a `TreeMap` of keys with a dummy value. It keeps elements sorted, so iteration is in
order and `first`, `last`, `headSet`, and `tailSet` are available. Cost per operation is
logarithmic.

Deduplication uses `compareTo` or the `Comparator`, not `equals`. A comparator that reports 0 for
two objects the program considers different silently drops one of them. This is a real source of
lost rows in reports sorted by one field only.

```java
TreeSet<String> hotels = new TreeSet<>();
hotels.add("Danube View");
hotels.add("Danube View");   // ignored, compareTo returns 0
String alphabeticallyFirst = hotels.first();
```

### Queue

`Queue` is first in, first out. The interface offers two sets of methods that differ only in how
they react to failure:

- `offer(e)` returns `false` when full. `add(e)` throws `IllegalStateException`.
- `poll()` returns `null` when empty. `remove()` throws `NoSuchElementException`.
- `peek()` returns `null` when empty. `element()` throws `NoSuchElementException`.

Use the returning versions in normal code, because a `null` check is cheaper to read than a
`try` block. `PriorityQueue` also implements `Queue`, but it hands out the smallest element by
comparator instead of the oldest, so it is not FIFO despite the interface.

```java
Queue<Booking> checkIn = new ArrayDeque<>();
checkIn.offer(booking);
Booking next = checkIn.poll();   // null when nothing waits
```

### Deque

`Deque` means double ended queue. You can add and remove at both ends:

- `addFirst`, `addLast`, `offerFirst`, `offerLast`
- `pollFirst`, `pollLast`, `peekFirst`, `peekLast`
- `push` and `pop`, which act on the front, so a `Deque` is also a stack.

`ArrayDeque` is the default implementation. It is not synchronized, it resizes by doubling, and
it rejects `null` elements. Rejecting null is a feature here: a `null` return from `poll` can
only mean empty. The old `Stack` class is synchronized, slower, and kept for compatibility.

```java
Deque<String> history = new ArrayDeque<>();
history.push("list");     // add to the front
history.push("map");
String last = history.pop();   // "map"
```

### Iterator

`Iterator` is the cursor behind every for-each loop. It has three methods: `hasNext`, `next`, and
`remove` (the last one is optional). The for-each form hides the cursor and therefore hides
removal, which is why deleting inside a for-each loop throws.

Collections in `java.util` are fail-fast. If the structure changes while an iterator is open,
except through that iterator's own `remove`, the next call throws
`ConcurrentModificationException`. The check is a modification counter compared on each step.

```java
Iterator<Booking> it = bookings.iterator();
while (it.hasNext()) {
    Booking b = it.next();
    if (b.nights() == 0) {
        it.remove();     // legal: removal through the iterator
    }
}
```

For bulk conditions, `removeIf` does the same job in one line and cannot get the counter wrong:

```java
bookings.removeIf(b -> b.nights() == 0);
```

`ListIterator` adds `hasPrevious`, `previous`, `set`, and `add`. It is what you want when editing
elements while walking a list.

### Comparator and sorting

`Comparable` is the class's own natural order, one per class, implemented as `compareTo`.
`Comparator` is an outside opinion, and a class can have as many as you need. Use a comparator
for report order and keep `compareTo` for the obvious identity order.

```java
Comparator<Booking> byNights = Comparator.comparingInt(Booking::nights);
Comparator<Booking> report = Comparator
        .comparing(Booking::city)
        .thenComparing(Booking::hotelName)
        .thenComparingInt(Booking::nights);
```

Chained calls apply left to right: the second key only decides ties. `reversed()` reverses
everything built so far, so put it at the end for a full reversal, or on a single key's
comparator when only that key should flip:

```java
Comparator<Booking> longestFirst = Comparator
        .comparingInt(Booking::nights).reversed()
        .thenComparing(Booking::hotelName);
```

Use `comparingInt`, `comparingLong`, and `comparingDouble` for numeric keys. They compare
primitives and skip boxing on every comparison. `nullsFirst` and `nullsLast` wrap a comparator
when a field can be null.

Sorting entry points:

- `list.sort(comparator)` sorts in place. `list.sort(null)` uses natural order.
- `Collections.sort(list)` is the older static form, same result.
- `Arrays.sort(array)` sorts arrays; `Arrays.sort(array, comparator)` for object arrays.
- `TreeMap` and `TreeSet` stay sorted without a call.
- Sorts of objects are stable, so equal elements keep their input order. Sorts of primitive
  arrays are not stable and cannot be, because equal primitives are indistinguishable.

Sorting a `Map` means sorting its entries:

```java
List<Map.Entry<String, Long>> rows = new ArrayList<>(revenue.entrySet());
rows.sort(Map.Entry.<String, Long>comparingByValue().reversed());
```

### equals and hashCode

`HashMap` and `HashSet` find a key in two steps: hash to a bucket, then `equals` inside the
bucket. The contract is short. Equal objects must return equal hash codes. Unequal objects may
share a hash code, and that only costs time.

If you write `equals`, write `hashCode`. If you use a `record`, both exist already. If a class
holds an array, use `Arrays.equals` and `Arrays.hashCode`, because the defaults compare
references. A `List` field is easier, since `List.equals` compares contents.

### Cost in one paragraph

Index access is constant in `ArrayList` and linear in `LinkedList`. Adding at the end is constant
amortized in both. Adding or removing at the front is linear in `ArrayList` and constant in
`LinkedList` and `ArrayDeque`. Key lookup is constant on average in `HashMap` and `HashSet`, and
logarithmic in `TreeMap` and `TreeSet`. Iteration is linear everywhere, with a constant factor
that favors arrays. Memory per element is lowest in arrays and highest in linked nodes.

## Examples

### Example 1: a list, a loop, and a total

```java
import java.util.ArrayList;
import java.util.List;

public class ListBasics {

    record Booking(String customerEmail, String city, int nights, int pricePerNight) {
        int total() {
            return nights * pricePerNight;
        }
    }

    public static void main(String[] args) {
        // Data shape: List<Booking>, one element per booking row
        List<Booking> bookings = new ArrayList<>();
        bookings.add(new Booking("anna@example.com", "Budapest", 3, 80));
        bookings.add(new Booking("bela@example.com", "Vienna", 1, 95));
        bookings.add(new Booking("csilla@example.com", "Budapest", 2, 70));

        int revenue = 0;
        for (Booking b : bookings) {
            revenue += b.total();
        }
        System.out.println("Bookings: " + bookings.size());
        System.out.println("Revenue: " + revenue);

        // Removing by condition keeps the list valid, no index bookkeeping needed.
        bookings.removeIf(b -> b.nights() == 0);

        // A copied list with a fixed size hint avoids repeated array growth.
        List<String> cities = new ArrayList<>(bookings.size());
        for (Booking b : bookings) {
            cities.add(b.city());
        }
        System.out.println("Cities: " + cities);
    }
}
```

`removeIf` replaced a manual iterator here. `ArrayList` also accepts a capacity in the
constructor, which matters when the loop adds thousands of rows.

### Example 2: count with a HashMap, deduplicate with a HashSet

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Counting {

    record Booking(String customerEmail, String city, int nights) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("anna@example.com", "Budapest", 3),
                new Booking("bela@example.com", "Vienna", 1),
                new Booking("anna@example.com", "Budapest", 2),
                new Booking("dora@example.com", "Budapest", 5));

        // Data shape: Map<String, Integer>, city to number of bookings
        Map<String, Integer> countByCity = new HashMap<>();
        Set<String> guests = new HashSet<>();

        for (Booking b : bookings) {
            countByCity.merge(b.city(), 1, Integer::sum);
            guests.add(b.customerEmail());   // add returns false on a duplicate
        }

        System.out.println("Cities: " + countByCity);
        System.out.println("Guests: " + guests.size());

        // Iterating a map means iterating one of its three views.
        for (Map.Entry<String, Integer> entry : countByCity.entrySet()) {
            System.out.printf("%-10s %d%n", entry.getKey(), entry.getValue());
        }
        for (String email : guests) {
            System.out.println("Guest: " + email);
        }
    }
}
```

`merge` removes the get, null check, and put sequence. `add` on the set does the same for
duplicate detection: the boolean answer is the duplicate check.

### Example 3: sorted report with a TreeMap and a comparator

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class SortedReport {

    record Booking(String hotelName, String city, int nights, int pricePerNight) {
        int total() {
            return nights * pricePerNight;
        }
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Danube View", "Budapest", 3, 80),
                new Booking("Alpen Hof", "Vienna", 4, 95),
                new Booking("Danube View", "Budapest", 1, 80),
                new Booking("City Inn", "Praha", 2, 60));

        // Data shape: TreeMap<String, Integer>, hotel name to revenue, always sorted
        Map<String, Integer> revenueByHotel = new TreeMap<>();
        for (Booking b : bookings) {
            revenueByHotel.merge(b.hotelName(), b.total(), Integer::sum);
        }
        System.out.println("Hotels in alphabetical order: " + revenueByHotel);

        // The list order is free, so the report needs an explicit comparator.
        List<Booking> report = new ArrayList<>(bookings);
        report.sort(Comparator
                .comparing(Booking::city)
                .thenComparing(Comparator.comparingInt(Booking::total).reversed())
                .thenComparing(Booking::hotelName));

        for (Booking b : report) {
            System.out.printf("%-9s %-12s %4d%n", b.city(), b.hotelName(), b.total());
        }
    }
}
```

The `TreeMap` gives alphabetical keys with no sort call. The list gives a three level order
that a map cannot express, which is why both appear in the same report. Notice the inner
`reversed()`: revenue is descending, while city and name stay ascending.

### Example 4: a waiting line with a Deque and a safe removal with an Iterator

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;

public class WaitingLine {

    record Booking(String guest, int nights) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = new ArrayList<>(List.of(
                new Booking("Anna", 3),
                new Booking("Bela", 0),
                new Booking("Csilla", 2),
                new Booking("Dora", 0)));

        // Data shape: Deque<Booking>, front is the next guest to serve
        Deque<Booking> line = new ArrayDeque<>();
        for (Booking b : bookings) {
            if (b.nights() > 0) {
                line.offerLast(b);
            }
        }

        boolean rebooked = false;
        while (!line.isEmpty()) {
            Booking next = line.pollFirst();
            System.out.println("Check in: " + next.guest());
            // One cancellation sends that guest to the back of the line, once.
            // Without the flag Csilla would cycle forever.
            if (!rebooked && next.guest().equals("Csilla")) {
                line.offerLast(next);
                rebooked = true;
            }
        }

        // Invalid rows are removed with the iterator that walks the list.
        Iterator<Booking> it = bookings.iterator();
        while (it.hasNext()) {
            if (it.next().nights() == 0) {
                it.remove();
            }
        }
        System.out.println("Valid bookings: " + bookings.size());
    }
}
```

The deque holds the line, the list keeps the history. The iterator removal is placed after the
loop on purpose: removing during the earlier for-each would throw.

### Example 5: booking desk, one program with every structure on this page

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

/**
 * BookingDesk is a complete console program that uses the collections from this page.
 *
 * Run:
 *   javac BookingDesk.java
 *   java BookingDesk
 *
 * Nothing is read from disk, the rows below stand in for the CSV file.
 */
public class BookingDesk {

    /** One booking row. A record supplies equals, hashCode, and toString. */
    record Booking(
            String customerEmail,
            String city,
            String hotelName,
            int nights,
            int pricePerNight) {

        int total() {
            return nights * pricePerNight;
        }
    }

    public static void main(String[] args) {
        // 1. ArrayList: the working list, order as read.
        List<Booking> bookings = new ArrayList<>(List.of(
                new Booking("anna@example.com", "Budapest", "Danube View", 3, 80),
                new Booking("bela@example.com", "Vienna", "Alpen Hof", 4, 95),
                new Booking("anna@example.com", "Budapest", "City Inn", 1, 60),
                new Booking("csilla@example.com", "Praha", "City Inn", 2, 60),
                new Booking("dora@example.com", "Budapest", "Danube View", 5, 80),
                new Booking("evelin@example.com", "Vienna", "Alpen Hof", 0, 95)));

        System.out.println("Rows read: " + bookings.size());

        // 2. HashSet: unique guests. add() answers false for a repeated email.
        Set<String> guests = new HashSet<>();
        for (Booking b : bookings) {
            guests.add(b.customerEmail());
        }
        System.out.println("Unique guests: " + guests.size());

        // 3. Iterator: drop rows with no nights. removeIf would do the same.
        Iterator<Booking> it = bookings.iterator();
        while (it.hasNext()) {
            if (it.next().nights() == 0) {
                it.remove();
            }
        }
        System.out.println("Valid rows: " + bookings.size());

        // 4. HashMap: city to list of bookings. computeIfAbsent avoids a null check.
        Map<String, List<Booking>> byCity = new HashMap<>();
        for (Booking b : bookings) {
            byCity.computeIfAbsent(b.city(), key -> new ArrayList<>()).add(b);
        }

        System.out.println("\nBookings per city:");
        for (Map.Entry<String, List<Booking>> entry : byCity.entrySet()) {
            int nights = 0;
            for (Booking b : entry.getValue()) {
                nights += b.nights();
            }
            System.out.printf("  %-9s %d booking(s), %d night(s)%n",
                    entry.getKey(), entry.getValue().size(), nights);
        }

        // 5. TreeMap: hotel name to revenue, sorted keys for free.
        Map<String, Integer> revenueByHotel = new TreeMap<>();
        for (Booking b : bookings) {
            revenueByHotel.merge(b.hotelName(), b.total(), Integer::sum);
        }
        System.out.println("\nRevenue by hotel (alphabetical):");
        for (Map.Entry<String, Integer> entry : revenueByHotel.entrySet()) {
            System.out.printf("  %-12s %6d%n", entry.getKey(), entry.getValue());
        }

        // 6. TreeSet: cities in order, no duplicates, no sort call.
        Set<String> sortedCities = new TreeSet<>();
        for (Booking b : bookings) {
            sortedCities.add(b.city());
        }
        System.out.println("\nCities: " + sortedCities);

        // 7. Comparator: revenue descending, hotel name ascending on ties.
        List<Booking> report = new ArrayList<>(bookings);
        report.sort(Comparator
                .comparingInt(Booking::total).reversed()
                .thenComparing(Booking::hotelName));
        System.out.println("\nTop bookings:");
        for (Booking b : report) {
            System.out.printf("  %-12s %-9s %5d%n", b.hotelName(), b.city(), b.total());
        }

        // 8. Comparator on map entries: who earned most.
        List<Map.Entry<String, Integer>> ranking = new ArrayList<>(revenueByHotel.entrySet());
        ranking.sort(Map.Entry.<String, Integer>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey()));
        System.out.println("\nBest hotel: " + ranking.get(0).getKey()
                + " with " + ranking.get(0).getValue());

        // 9. Deque: a check-in line, reused as a stack for the undo history.
        Deque<Booking> line = new ArrayDeque<>();
        for (Booking b : report) {
            line.offerLast(b);
        }

        Deque<String> history = new ArrayDeque<>();
        System.out.println("\nCheck in:");
        int served = 0;
        while (!line.isEmpty() && served < 3) {
            Booking next = line.pollFirst();
            history.push(next.customerEmail());
            System.out.printf("  %s at %s%n", next.customerEmail(), next.hotelName());
            served++;
        }

        // 10. Total revenue from the map built earlier, no second pass on the list.
        int total = 0;
        for (int value : revenueByHotel.values()) {
            total += value;
        }
        System.out.println("\nTotal revenue: " + total);
        System.out.println("Last served (undo stack top): " + history.peek());
        System.out.println("Still waiting: " + line.size());
    }
}
```

Read it in order and each block answers one exam style question: count, distinct, remove bad
rows, group, sort, rank, queue. The structures change because the question changes, not because
the code got fancy.

## More examples

These programs go past the first five. Each one is a complete file, compiled with `javac`
21, and each answers a question that appears in the exam in a slightly different wording.

### Example 6: frequency counting, flat and nested

The first counting loop in an exam is usually a single map of counters. The second one
nests: cities that hold hotels that hold nights. Both use `merge`, and the outer map is a
`TreeMap` so the printout needs no sort call.

```java
// File: FrequencyReport.java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * FrequencyReport answers the counting questions in one pass: how many rows per
 * city, how many nights per hotel inside each city, and which cities lead.
 *
 * Run:
 *   javac FrequencyReport.java
 *   java FrequencyReport
 */
public class FrequencyReport {

    record Booking(String customerEmail, String city, String hotelName, int nights) {
    }

    public static void main(String[] args) {
        // Data shape: List<Booking>, one element per row, order as read.
        List<Booking> bookings = new ArrayList<>(List.of(
                new Booking("anna@example.com", "Budapest", "Danube View", 3),
                new Booking("bela@example.com", "Vienna", "Alpen Hof", 4),
                new Booking("anna@example.com", "Budapest", "City Inn", 1),
                new Booking("csilla@example.com", "Praha", "City Inn", 2),
                new Booking("dora@example.com", "Budapest", "Danube View", 5),
                new Booking("evelin@example.com", "Vienna", "Alpen Hof", 1)));

        // Flat frequency: city to number of rows. merge() inserts 1 or adds to the old value.
        // Data shape: Map<String, Integer>, city to row count.
        Map<String, Integer> rowsByCity = new HashMap<>();
        for (Booking b : bookings) {
            rowsByCity.merge(b.city(), 1, Integer::sum);
        }

        // Nights per city, in a TreeMap so the printout is alphabetical with no sort call.
        // Data shape: Map<String, Integer>, city to summed nights.
        Map<String, Integer> nightsByCity = new TreeMap<>();
        for (Booking b : bookings) {
            nightsByCity.merge(b.city(), b.nights(), Integer::sum);
        }

        // Nested frequency: city to hotel to nights.
        // Data shape: Map<String, Map<String, Integer>>, outer key ordered.
        Map<String, Map<String, Integer>> nightsByCityHotel = new TreeMap<>();
        for (Booking b : bookings) {
            nightsByCityHotel
                    .computeIfAbsent(b.city(), key -> new TreeMap<>())
                    .merge(b.hotelName(), b.nights(), Integer::sum);
        }

        System.out.println("Rows per city: " + rowsByCity);
        System.out.println("Nights per city: " + nightsByCity);

        System.out.println("\nNights per hotel inside each city:");
        for (Map.Entry<String, Map<String, Integer>> city : nightsByCityHotel.entrySet()) {
            for (Map.Entry<String, Integer> hotel : city.getValue().entrySet()) {
                System.out.printf("  %-9s %-12s %d%n",
                        city.getKey(), hotel.getKey(), hotel.getValue());
            }
        }

        // Ranking needs a list: a map has no order, and the sort key is the value.
        // Data shape: List<Map.Entry<String, Integer>>, sorted by value descending.
        List<Map.Entry<String, Integer>> ranking = new ArrayList<>(nightsByCity.entrySet());
        ranking.sort(Map.Entry.<String, Integer>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey()));

        System.out.println("\nTop cities by nights:");
        ranking.stream().limit(2).forEach(e ->
                System.out.printf("  %-9s %d%n", e.getKey(), e.getValue()));

        // The total comes from the map, so the list is not walked a second time.
        int total = 0;
        for (int nights : nightsByCity.values()) {
            total += nights;
        }
        System.out.println("\nTotal nights: " + total);

        // Comparator on the entries again, this time ascending, to show the flip.
        ranking.sort(Comparator.comparing(Map.Entry::getKey));
        System.out.println("Alphabetical: " + ranking.get(0).getKey());
    }
}
```

`merge` does three jobs in one call: it inserts the first value, adds to an existing value,
and never leaves a null behind. The nested map works the same way once `computeIfAbsent`
creates the inner map. The ranking at the end converts entries to a list because a map has
no order to sort.

### Example 7: equals and hashCode in one class

A hand written key class is the fastest way to lose rows in a map. This program shows a
correct key, the same key as a record, and two ways to break the contract.

```java
// File: KeyContract.java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * KeyContract shows why a key class needs both equals and hashCode, and what
 * happens to a key that changes after it entered the map.
 *
 * Run:
 *   javac KeyContract.java
 *   java KeyContract
 */
public class KeyContract {

    /** A key written by hand: equals and hashCode must agree on the same fields. */
    static final class RoomKey {
        private final int hotelId;
        private final int roomNumber;

        RoomKey(int hotelId, int roomNumber) {
            this.hotelId = hotelId;
            this.roomNumber = roomNumber;
        }

        @Override
        public boolean equals(Object other) {
            // Identity first: cheap and it protects the cast below.
            if (this == other) {
                return true;
            }
            if (!(other instanceof RoomKey)) {
                return false;
            }
            RoomKey that = (RoomKey) other;
            return hotelId == that.hotelId && roomNumber == that.roomNumber;
        }

        @Override
        public int hashCode() {
            // The same two fields as equals, in the same order. Objects.hash is a readable default.
            return Objects.hash(hotelId, roomNumber);
        }

        @Override
        public String toString() {
            return hotelId + "/" + roomNumber;
        }
    }

    /** The same key as a record: equals, hashCode, and toString are generated. */
    record RoomRef(int hotelId, int roomNumber) {
    }

    public static void main(String[] args) {
        // Data shape: Map<RoomKey, String>, room to guest email.
        Map<RoomKey, String> guestByRoom = new HashMap<>();
        guestByRoom.put(new RoomKey(7, 101), "anna@example.com");
        guestByRoom.put(new RoomKey(7, 102), "bela@example.com");

        // A fresh key object with the same values finds the entry, because equals says they match.
        String guest = guestByRoom.get(new RoomKey(7, 101));
        System.out.println("Guest in 7/101: " + guest);

        // A set deduplicates on the same pair of methods.
        // Data shape: Set<RoomRef>, unique rooms.
        Set<RoomRef> rooms = new HashSet<>();
        System.out.println("first add: " + rooms.add(new RoomRef(7, 101)));
        System.out.println("second add: " + rooms.add(new RoomRef(7, 101)));
        System.out.println("rooms: " + rooms);

        // The record version behaves identically and needs no code.
        Map<RoomRef, Integer> nightsByRoom = new HashMap<>();
        nightsByRoom.put(new RoomRef(7, 101), 3);
        System.out.println("nights: " + nightsByRoom.get(new RoomRef(7, 101)));

        // Broken variant: a key whose hashCode changes after insertion.
        // The entry stays in the old bucket, so get() with an equal key misses it.
        Map<RoomRef, Integer> stable = new HashMap<>();
        RoomRef key = new RoomRef(8, 5);
        stable.put(key, 2);
        System.out.println("lookup before change: " + stable.get(new RoomRef(8, 5)));

        // A record field is final, so this cannot happen to RoomRef. A mutable class can do it:
        MutableKey mutable = new MutableKey("budapest");
        Set<MutableKey> keys = new HashSet<>();
        keys.add(mutable);
        mutable.city = "vienna";     // the hash changed, the bucket did not
        System.out.println("contains after mutation: " + keys.contains(new MutableKey("vienna")));

        // With equals but no hashCode, two equal objects land in different buckets.
        Set<NoHash> broken = new HashSet<>();
        broken.add(new NoHash("budapest"));
        System.out.println("equals only, contains: " + broken.contains(new NoHash("budapest")));
    }

    static final class MutableKey {
        String city;

        MutableKey(String city) {
            this.city = city;
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof MutableKey && city.equals(((MutableKey) other).city);
        }

        @Override
        public int hashCode() {
            return city.hashCode();
        }
    }

    static final class NoHash {
        final String city;

        NoHash(String city) {
            this.city = city;
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof NoHash && city.equals(((NoHash) other).city);
        }
    }
}
```

The `NoHash` class produces the warning `overrides equals, but neither it nor any superclass
overrides hashCode` under `javac -Xlint:all`, which is the compiler telling you the set
lookup will fail. The mutable key program prints `false` after the field changes, because
the entry stayed in the bucket it was hashed into.

### Example 8: editing a LinkedList and reusing it as a queue

`LinkedList` earns its place in two jobs: inserting in the middle through a cursor, and
walking backwards. Everything else on the page uses it as a queue, where `ArrayDeque` is the
better class.

```java
// File: MidListEdits.java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.ListIterator;
import java.util.Queue;

/**
 * MidListEdits edits a linked list in place and then uses the same class as a
 * queue, which is the only situation where LinkedList beats ArrayList outright.
 *
 * Run:
 *   javac MidListEdits.java
 *   java MidListEdits
 */
public class MidListEdits {

    record Task(String name, int priority) {
    }

    public static void main(String[] args) {
        // Data shape: LinkedList<Task>, insertion order, edited through cursors.
        LinkedList<Task> agenda = new LinkedList<>();
        agenda.add(new Task("print arrivals", 2));
        agenda.add(new Task("close till", 1));
        agenda.add(new Task("answer mail", 3));

        // ListIterator can insert, replace, and walk backwards. A for-each cannot.
        ListIterator<Task> cursor = agenda.listIterator();
        while (cursor.hasNext()) {
            Task task = cursor.next();
            if (task.priority() >= 2) {
                // Insert before the cursor: the node links change, no array shifts.
                cursor.add(new Task("check " + task.name(), task.priority()));
            }
            if (task.name().equals("close till")) {
                cursor.set(new Task("close till and count cash", task.priority()));
            }
        }

        System.out.println("Agenda:");
        agenda.forEach(t -> System.out.printf("  [%d] %s%n", t.priority(), t.name()));

        // Backwards walk: only a ListIterator or a descendingIterator can do this.
        System.out.println("Last task first:");
        for (ListIterator<Task> back = agenda.listIterator(agenda.size()); back.hasPrevious(); ) {
            System.out.println("  " + back.previous().name());
        }

        // Iterator removal is the safe delete. removeIf would do the same in one line.
        Iterator<Task> walk = agenda.iterator();
        while (walk.hasNext()) {
            if (walk.next().name().startsWith("check ")) {
                walk.remove();
            }
        }
        System.out.println("After cleanup: " + agenda.size() + " task(s)");

        // Queue view: offer adds at the tail, poll takes from the head, null means empty.
        // Data shape: Queue<Task> holding pending work in arrival order.
        Queue<Task> pending = new ArrayDeque<>(agenda);
        while (!pending.isEmpty()) {
            Task next = pending.poll();
            System.out.println("Working on: " + next.name());
        }

        // Deque as a stack: push and pop work on the front, so the order reverses.
        // Data shape: Deque<String> for the undo history.
        Deque<String> undo = new ArrayDeque<>();
        undo.push("drop row 4");
        undo.push("edit row 2");
        System.out.println("Undo first: " + undo.pop());
        System.out.println("Undo next: " + undo.pop());
        System.out.println("Nothing left: " + undo.peek());
    }
}
```

`ListIterator.add` inserts at the cursor and does not disturb the walk, unlike a `List.add`
inside a for-each loop, which throws `ConcurrentModificationException`. The `Queue` variable
hides the implementation, so the same code runs on an `ArrayDeque` or a `PriorityQueue`.

### Example 9: ranges and neighbours with TreeMap and TreeSet

A sorted map answers questions a `HashMap` cannot: what comes before this key, what falls
inside a range, and what is the next key up. The methods are `floorKey`, `ceilingKey`,
`headMap`, `tailMap`, and `subMap`.

```java
// File: RangeReport.java
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.NavigableSet;
import java.util.TreeMap;
import java.util.TreeSet;

/**
 * RangeReport answers the questions that need sorted keys: which year comes
 * before this one, what falls inside a range, and what the neighbours are.
 *
 * Run:
 *   javac RangeReport.java
 *   java RangeReport
 */
public class RangeReport {

    record Booking(String city, String hotelName, int nights, int total) {
    }

    public static void main(String[] args) {
        List<Booking> bookings = List.of(
                new Booking("Budapest", "Danube View", 3, 240),
                new Booking("Vienna", "Alpen Hof", 4, 380),
                new Booking("Budapest", "City Inn", 1, 60),
                new Booking("Praha", "City Inn", 2, 120),
                new Booking("Budapest", "Danube View", 5, 400));

        // Data shape: TreeMap<String, Integer>, hotel to revenue, keys kept sorted.
        NavigableMap<String, Integer> revenueByHotel = new TreeMap<>();
        for (Booking b : bookings) {
            revenueByHotel.merge(b.hotelName(), b.total(), Integer::sum);
        }

        System.out.println("All hotels: " + revenueByHotel);

        // Neighbours without a scan: floor is at or below, ceiling is at or above.
        System.out.println("At or before Danube View: " + revenueByHotel.floorKey("Danube View"));
        System.out.println("At or after Danube View:  " + revenueByHotel.ceilingKey("Danube View"));
        System.out.println("First and last: " + revenueByHotel.firstKey()
                + ", " + revenueByHotel.lastKey());

        // Range views are backed by the map: subMap includes the low key, excludes the high key.
        System.out.println("A to C: " + revenueByHotel.subMap("A", "D"));
        System.out.println("From Danube View up: " + revenueByHotel.tailMap("Danube View", true));

        // Descending view, no copy, no sort call.
        System.out.println("Descending: " + revenueByHotel.descendingMap());

        // A custom key order: longest hotel name first is meaningless, so reverse alphabetical here.
        // Data shape: Map<String, Integer> with a Comparator on the keys.
        Map<String, Integer> reverse = new TreeMap<>(Comparator.reverseOrder());
        reverse.putAll(revenueByHotel);
        System.out.println("Reverse keys: " + reverse);

        // Data shape: TreeSet<Integer>, years present in the data, sorted and unique.
        NavigableSet<Integer> years = new TreeSet<>(List.of(2021, 2023, 2024, 2026));
        System.out.println("First after 2022: " + years.higher(2022));
        System.out.println("Last before 2026: " + years.lower(2026));
        System.out.println("Up to 2024: " + years.headSet(2024, true));
        System.out.println("From 2023: " + years.tailSet(2023));

        // A reminder about the comparator: ties compare as 0 and one row disappears.
        // Data shape: TreeSet<Booking> ordered by nights only, so equal totals collide.
        TreeSet<Booking> byNights = new TreeSet<>(Comparator.comparingInt(Booking::nights));
        byNights.add(new Booking("Budapest", "Danube View", 3, 240));
        byNights.add(new Booking("Vienna", "Alpen Hof", 3, 380));   // dropped: same nights
        System.out.println("Rows kept by the nights comparator: " + byNights.size());

        // Add a tie breaker and both rows survive: the comparator is the identity here.
        TreeSet<Booking> safe = new TreeSet<>(Comparator
                .comparingInt(Booking::nights)
                .thenComparing(Booking::hotelName)
                .thenComparing(Booking::city));
        safe.addAll(List.of(
                new Booking("Budapest", "Danube View", 3, 240),
                new Booking("Vienna", "Alpen Hof", 3, 380)));
        System.out.println("Rows kept with a tie breaker: " + safe.size());
    }
}
```

`subMap` includes the low key and excludes the high key unless you pass the boolean flags.
Views are backed by the original map, so a write through the view is a write to the map. The
last block prints the classic `TreeSet` failure: two bookings with equal nights compare as 0
and one disappears, until a tie breaker is added.

### Example 10: an LRU cache with LinkedHashMap

A cache with a size limit is one subclass when the map already tracks order. `LinkedHashMap`
keeps either insertion order or access order, and one overridden method decides what to
evict.

```java
// File: LruCache.java
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LruCache keeps the last N keys used and drops the least recently used one.
 * LinkedHashMap already maintains the order, so the whole cache is one hashCode-free
 * override of removeEldestEntry.
 *
 * Run:
 *   javac LruCache.java
 *   java LruCache
 */
public class LruCache<K, V> extends LinkedHashMap<K, V> {

    private final int capacity;

    /** accessOrder true moves a key to the end on every get, which is the LRU part. */
    LruCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // Returning true makes put() delete the head of the order, so size never passes capacity.
        return size() > capacity;
    }

    public static void main(String[] args) {
        // Data shape: LruCache<String, Integer>, hotel name to nightly price, max 3 entries.
        LruCache<String, Integer> prices = new LruCache<>(3);

        prices.put("Danube View", 80);
        prices.put("Alpen Hof", 95);
        prices.put("City Inn", 60);
        System.out.println("After three puts: " + prices);

        // A get counts as a use, so Danube View moves to the most recent end.
        prices.get("Danube View");

        // The fourth put evicts the head of the order, which is now Alpen Hof.
        prices.put("Park Hotel", 110);
        System.out.println("After eviction: " + prices.keySet());
        System.out.println("Alpen Hof still cached: " + prices.containsKey("Alpen Hof"));
        System.out.println("Danube View still cached: " + prices.containsKey("Danube View"));

        // A plain LinkedHashMap with insertion order keeps the first key at the head instead.
        // Data shape: Map<String, Integer> in insertion order, useful for a stable report.
        Map<String, Integer> insertionOrder = new LinkedHashMap<>();
        insertionOrder.put("first", 1);
        insertionOrder.put("second", 2);
        insertionOrder.put("first", 3);   // same key, position unchanged, value replaced
        System.out.println("Insertion order: " + insertionOrder);

        // Re-inserting in access order would move the key to the end of this map.
        Map<String, Integer> accessOrder = new LinkedHashMap<>(4, 0.75f, true);
        accessOrder.put("a", 1);
        accessOrder.put("b", 2);
        accessOrder.get("a");
        System.out.println("Access order: " + accessOrder.keySet());
    }
}
```

The constructor argument `true` is access order, so `get` moves a key to the most recent
end. `removeEldestEntry` runs after every `put` and returns true when the map is over
capacity, which makes `put` remove the head. The same class with `false` gives insertion
order, the shape you want for a stable report.

### Example 11: sorting the same record four ways

One record, four comparators: a report order with one descending key, a fully reversed
chain, field order, and a null safe order. The program also shows the difference between
sorting a list and inserting into a `TreeSet`.

```java
// File: SortRecords.java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * SortRecords sorts the same record four ways and shows where a missing tie
 * breaker bites: a sort keeps every row, a TreeSet drops the ties.
 *
 * Run:
 *   javac SortRecords.java
 *   java SortRecords
 */
public class SortRecords {

    record Booking(String city, String hotelName, int nights, int total) {
    }

    public static void main(String[] args) {
        // Data shape: List<Booking>, the rows to sort, order as read.
        List<Booking> bookings = new ArrayList<>(List.of(
                new Booking("Budapest", "Danube View", 3, 240),
                new Booking("Vienna", "Alpen Hof", 4, 380),
                new Booking("Praha", "City Inn", 2, 120),
                new Booking("Budapest", "City Inn", 1, 240),
                new Booking("Vienna", "Alpen Hof", 2, 190)));

        // Comparator 1: city ascending, revenue descending, name ascending.
        // reversed() sits on the revenue key only, so city and name stay ascending.
        Comparator<Booking> report = Comparator
                .comparing(Booking::city)
                .thenComparing(Comparator.comparingInt(Booking::total).reversed())
                .thenComparing(Booking::hotelName);

        List<Booking> byReport = new ArrayList<>(bookings);
        byReport.sort(report);
        System.out.println("Report order:");
        byReport.forEach(b -> System.out.printf("  %-9s %-12s %4d%n",
                b.city(), b.hotelName(), b.total()));

        // Comparator 2: the whole chain flipped. reversed() goes last.
        List<Booking> longestFirst = new ArrayList<>(bookings);
        longestFirst.sort(Comparator.comparingInt(Booking::nights).reversed()
                .thenComparing(Booking::hotelName));
        System.out.println("\nLongest stay first: " + longestFirst.get(0).nights() + " nights");

        // Comparator 3: natural order of the record fields, one after another.
        List<Booking> natural = new ArrayList<>(bookings);
        natural.sort(Comparator.comparing(Booking::city)
                .thenComparing(Booking::hotelName)
                .thenComparingInt(Booking::nights));
        System.out.println("First row in field order: " + natural.get(0));

        // Stability: equal keys keep their input order, so the second Budapest row stays second.
        List<Booking> stable = new ArrayList<>(bookings);
        stable.sort(Comparator.comparing(Booking::city));
        System.out.println("\nStable sort, equal cities:");
        stable.stream().filter(b -> b.city().equals("Budapest"))
                .forEach(b -> System.out.println("  " + b.hotelName() + " " + b.nights()));

        // Queue: a smallest-first work list. PriorityQueue orders by the comparator, not by arrival.
        // Data shape: Queue<Booking> with the shortest stay on top.
        Queue<Booking> shortestFirst = new PriorityQueue<>(
                Comparator.comparingInt(Booking::nights));
        shortestFirst.addAll(bookings);
        System.out.println("\nPriority queue poll order:");
        while (!shortestFirst.isEmpty()) {
            System.out.println("  " + shortestFirst.poll().nights() + " nights");
        }

        // Comparator with nulls: a missing total sorts last instead of throwing.
        // Data shape: List<Integer>, one total per row, some rows have no price yet.
        List<Integer> totals = new ArrayList<>(List.of(240, 380, 120));
        totals.add(null);
        totals.sort(Comparator.nullsLast(Comparator.naturalOrder()));
        System.out.println("\nNulls last: " + totals);
    }
}
```

A sort keeps every row and is stable, so equal keys keep their input order. A `TreeSet` uses
the comparator as identity and drops rows that compare as 0. `nullsLast` is the cheap fix
for a column that is not filled in yet, because `Comparator.naturalOrder()` throws on null.

## Common mistakes

- Calling `get(i)` inside a loop over a `LinkedList`. Each call walks the chain, so the loop
  becomes quadratic. Use a for-each loop or an iterator.
- Using `List.of(...)` and then calling `add`. The list from `List.of` is immutable. Wrap it in
  `new ArrayList<>(...)`.
- Sorting a `HashMap` and expecting the map to stay sorted. A map has no order to preserve.
  Put the data in a `TreeMap`, or sort a copy of `entrySet()`.
- Writing `equals` without `hashCode` and using the object as a `HashMap` key. Lookups fail even
  though the object is in the map.
- Changing a field used in `hashCode` after insertion. The entry becomes unreachable through
  normal lookup.
- Removing elements inside a for-each loop, which throws `ConcurrentModificationException`. Use
  `iterator.remove()` or `removeIf`.
- Comparing strings with `==`. Use `equals`, and for map keys it matters because the bucket lookup
  uses `equals`.
- Expecting `TreeSet` to keep two elements that compare as 0 but are not `equals`. The comparator
  wins and one element disappears.
- Putting a `null` key into a `TreeMap` with natural ordering, or a `null` element into an
  `ArrayDeque`. Both throw `NullPointerException`.
- Using `Stack` for new code. `ArrayDeque.push` and `pop` are the modern replacement.
- Assuming `HashMap` iteration matches insertion order. It does not, and a resize can change what
  you saw in a test run.
- Reversing a comparator chain by putting `reversed()` after only the first key then adding more
  keys. Everything after the call is already part of the reversed chain, so order the keys first
  and reverse at the end when the whole order should flip.

## Exam checklist

1. Can you name the four questions that pick a collection, and map each to a class?
2. Can you state the cost of `get` on `ArrayList` and `LinkedList` and explain why they differ?
3. Can you write `put`, `getOrDefault`, `merge`, and `computeIfAbsent` on a `HashMap` from memory?
4. Can you build a `TreeMap` report of revenue by hotel and print it in key order?
5. Can you remove rows from a list with an `Iterator` and with `removeIf`, and say why a for-each
   loop fails?
6. Can you write a three key comparator with one key descending?
7. Can you explain why `HashSet<String>` removes duplicates and why a custom class needs
   `equals` and `hashCode`?
8. Can you pick between `Queue`, `Deque`, and `PriorityQueue` for a waiting line, a stack, and a
  smallest-first task list?
9. Do you know which `Queue` methods return a value and which throw?
10. Can you convert a list to a sorted `Map` without sorting the map itself?
