# Java collections

Java topic · Exam Wiki

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

