---
id: java-core-examples
lang: Java
title: Java core examples
---

# Java core examples

The Java exam is a set of small programs. Read a line, split it, count something, add a date,
sort a list, print a report. The language details that cost marks are the ones a tutorial shows
once: `String` cannot change, an array cannot grow, a record has no setters, a scanner keeps the
line break that a previous `nextInt` left behind.

This page is a working set. Every area has a short explanation, then a complete class you can
compile. The last example is a booking desk that uses most of the page in one file. Run
`javac --release 21 FileName.java` and `java FileName` on each one.

## Simplest form

```java
// Data shape: one public class, one file, the file name matches the class name
// File: Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("hello");
    }
}
```

That is the shape of every program on this page. `javac Hello.java` writes `Hello.class`,
`java Hello` runs it. Arguments arrive in `args`, and its length is exactly the number of words
typed after the class name, so check `args.length` before reading `args[0]`.

## What it does

A Java source file declares classes. The JVM runs the `static void main(String[] args)` method
of the class you name on the command line. Everything else is a library call or a value.

Three rules shape the code you write under time pressure:

1. Types are checked at compile time. `int` and `String` never mix silently, and a checked
   exception must be handled or declared.
2. Objects are references. Assigning one to another copies the pointer, not the content, which
   is why `list2 = list1` makes two names for one list.
3. The library is large. `java.util`, `java.time`, `java.nio.file`, and `java.util.stream`
   cover almost every exam task, so reach for a method before writing a loop.

## Every part

### Strings are immutable objects

`String` holds a `char` sequence that never changes. `toUpperCase`, `substring`, `replace`, and
`strip` each return a new string, and the original stays as it was. That is why a loop that
builds a string by concatenation allocates a new object per pass.

`split` takes a regular expression, so `split(".")` splits on every character, and
`split("\\|")` is needed for a pipe. `strip` removes Unicode whitespace while the old `trim`
removes only characters up to U+0020. `formatted` is `String.format` with the format string on
the left.

### StringBuilder when a loop builds text

`StringBuilder` wraps a growable `char[]`. `append` returns the same builder, which is why the
calls chain. `toString` copies the buffer at that moment, so later appends do not change the
string you already took. `StringBuffer` is the synchronized sibling; exam code almost never
needs it.

### Arrays are fixed length

`new int[5]` locks the length. `length` is a field, not a method, and `Arrays.copyOf` is the way
to get a longer array. `Arrays.sort` sorts in place, `Arrays.binarySearch` requires a sorted
array, `Arrays.toString` prints one dimension, and `Arrays.deepToString` prints nested arrays.
`array1.equals(array2)` compares references, so use `Arrays.equals` for content.

### Dates

`LocalDate` is a date without time or zone, immutable, and prints in ISO form
`yyyy-MM-dd`. `ChronoUnit.DAYS.between` returns a number, `Period.between` returns years, months
and days. `DateTimeFormatter.ofPattern` builds a display format, and the same formatter is needed
to parse that text back. Pass a `Locale` when the pattern has month or day names, otherwise the
output depends on the machine.

### Records

A record declares data. The compiler generates a canonical constructor, one accessor per
component, `equals`, `hashCode`, and `toString`. A compact constructor validates or normalises
before the fields are assigned. Records cannot extend a class, cannot declare extra instance
fields, and are implicitly final. They can implement interfaces and hold static members.

### Scanner

`Scanner` splits input into tokens, by default on whitespace. `nextInt` reads a token as an
`int`, `nextLine` reads to the end of the current line, and the `hasNextX` methods guard the
read. Mixing `nextInt` and `nextLine` is the classic failure: after `nextInt` the line break is
still in the buffer, so `nextLine` returns an empty string.

### Enums

An enum is a class with a fixed set of instances. Each constant is created once, at class load.
Constants may carry fields through a constructor, which is always private. `values()` returns a
fresh array each call, `name()` is the constant as written, and `ordinal()` is its position.
`valueOf` throws `IllegalArgumentException` for an unknown name.

### Generics

A type parameter is checked at compile time and erased at run time. `Box<String>` and
`Box<Integer>` are one class after compilation, which is why `new T[]` and `instanceof T` do not
work. Bounds such as `<T extends Comparable<T>>` let the body call methods of the bound.
Wildcards (`? extends Number`, `? super Integer`) describe what a method may read or write.

### Threads

`Thread` is a thread; `Runnable` is a job. Call `start`, never `run`, or the job runs on your
thread. `join` waits for the end. For more than one job, an `ExecutorService` from
`Executors.newFixedThreadPool` reuses threads, and `shutdown` plus `awaitTermination` gives a
clean end. Shared mutable state needs `synchronized`, a lock, or an atomic type.

### Lambdas and functional interfaces

A lambda is the implementation of a functional interface, meaning an interface with one abstract
method. `Comparator`, `Runnable`, `Predicate`, `Function`, and `Consumer` are the ones you type.
A lambda may read local variables only if they are effectively final. A method reference such as
`Guest::name` is the short form when the body only calls one existing method.

### HashMap and HashSet

`HashMap` stores key to value pairs, with `equals` and `hashCode` deciding the bucket. `put`
returns the previous value, `get` returns `null` for a missing key, `merge` and
`computeIfAbsent` remove the check-then-put pattern. Iteration order is not insertion order.
`HashSet` is a `HashMap` with keys only, so `add` returns `false` on a duplicate. Both allow one
`null` key or element and neither is sorted.

### try-with-resources

Any `AutoCloseable` declared in the parentheses of `try` is closed when the block ends, in
reverse order, even when the body throws. If `close` also throws, that exception is attached as
suppressed to the first one. `Files.readString`, `readAllLines`, and `lines` open and close the
file themselves, so no block is needed.

### var

`var` infers the type of a local variable from its initialiser. The type is fixed at compile
time; it is not `Object` and it is not dynamic. It cannot be used for fields, method parameters,
or a variable without an initialiser. Use it when the right-hand side already names the type,
as in `var guests = new ArrayList<Guest>()`.

### switch expressions

The arrow form has no fallthrough and no `break`. A `case` may list several labels, a block case
returns with `yield`, and the whole switch is a value. On an enum or a sealed hierarchy the
compiler checks exhaustiveness, so no `default` is needed. Java 21 adds `when` guards and type
patterns, which turn a chain of `instanceof` checks into one switch.

## Examples

### Example 1: Split, clean, and format one line

```java
// File: GuestLine.java
import java.util.Arrays;

public class GuestLine {
    public static void main(String[] args) {
        String row = "  anna@example.com ; Budapest ;3 ";

        // split takes a regex, so a pipe or a dot would need escaping
        String[] parts = row.split(";");
        System.out.println(parts.length); // 3

        // strip removes Unicode whitespace at both ends
        String email = parts[0].strip();
        String city = parts[1].strip();
        int nights = Integer.parseInt(parts[2].strip());

        // join puts the separator between elements, never after the last one
        System.out.println(String.join("|", email, city, String.valueOf(nights)));

        // %s text, %d integer, %-12s left aligned in 12 columns, %n line break
        System.out.printf("%-12s %-10s %d%n", email, city, nights);

        // == compares references, equals compares characters
        String a = "Budapest";
        String b = new String("Budapest");
        System.out.println(a == b);      // false
        System.out.println(a.equals(b)); // true

        // a text block keeps the line breaks and removes the common indentation
        String note = """
                guest: %s
                city:  %s
                """.formatted(email, city);
        System.out.print(note);

        // the array still carries the spaces around the fields
        System.out.println(Arrays.toString(parts));
    }
}
```

The `Arrays.toString` line is worth remembering in an exam: `System.out.println(array)` prints
something like `[Ljava.lang.String;@1b6d3586`, which looks like a bug and is only a missing call.

### Example 2: Build a report in a loop

```java
// File: CityReport.java
import java.util.List;

public class CityReport {
    public static void main(String[] args) {
        List<String> hotels = List.of("Danube View", "City Loft", "Lake Garden");

        // Concatenation in a loop copies the whole text on every pass.
        // StringBuilder appends into one growable buffer instead.
        StringBuilder report = new StringBuilder();
        report.append("Hotels").append(System.lineSeparator());
        for (int i = 0; i < hotels.size(); i++) {
            // append returns this, so the calls chain
            report.append(i + 1).append(". ").append(hotels.get(i)).append('\n');
        }

        // insert and reverse act on the buffer itself
        report.insert(0, "== draft ==" + '\n');
        System.out.print(report);

        // toString copies the buffer, so a later append cannot change the snapshot
        String snapshot = report.toString();
        report.append("total: ").append(hotels.size()).append('\n');
        System.out.println(snapshot.equals(report.toString())); // false

        // setLength(0) empties the builder without allocating a new one
        report.setLength(0);
        System.out.println(report.isEmpty()); // true
    }
}
```

`StringBuilder` is not thread safe. A builder shared between threads needs external locking, and
that is the only reason `StringBuffer` still exists.

### Example 3: Sort, search, and copy an array

```java
// File: ScoreTable.java
import java.util.Arrays;

public class ScoreTable {
    public static void main(String[] args) {
        int[] scores = {42, 7, 19, 88, 3};

        // sort works in place and ascending
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores)); // [3, 7, 19, 42, 88]

        // binarySearch requires the sorted order. A hit returns the index,
        // a miss returns -(insertion point) - 1.
        System.out.println(Arrays.binarySearch(scores, 19)); // 2
        System.out.println(Arrays.binarySearch(scores, 20)); // -4

        // copyOf keeps the first elements and pads the rest with zeros
        int[] padded = Arrays.copyOf(scores, 7);
        System.out.println(Arrays.toString(padded));

        // fill writes the same value into every slot
        int[] flags = new int[4];
        Arrays.fill(flags, 1);
        System.out.println(Arrays.toString(flags));

        // a 2D array is an array of arrays, so rows may have different lengths
        int[][] grid = new int[2][3];
        grid[1][2] = 5;
        System.out.println(Arrays.deepToString(grid));

        // length is a field on the array object
        System.out.println(grid.length + " x " + grid[0].length);
    }
}
```

A negative result from `binarySearch` is a position, not an error. The formula
`-index - 1` gives the place where the value would be inserted, which is how you add a missing
element at the right spot.

### Example 4: Dates, difference, and a display format

```java
// File: StayDates.java
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

public class StayDates {
    public static void main(String[] args) {
        // ISO text is the default shape: 2026-05-11
        LocalDate start = LocalDate.parse("2026-05-11");
        LocalDate end = LocalDate.of(2026, 5, 18);

        // every change returns a new date, the original is untouched
        System.out.println(start.plusDays(2)); // 2026-05-13
        System.out.println(start);             // 2026-05-11

        // a number of days, then a period of years, months and days
        System.out.println(ChronoUnit.DAYS.between(start, end)); // 7
        Period stay = Period.between(start, end);
        System.out.println(stay.getDays()); // 7

        // ordering is built in
        System.out.println(end.isAfter(start)); // true

        // MMM is a month name, so the locale decides the spelling
        DateTimeFormatter display =
                DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
        System.out.println(end.format(display)); // 18 May 2026

        // parsing needs the same pattern that produced the text
        LocalDate parsed = LocalDate.parse("18 May 2026", display);
        System.out.println(parsed.equals(end)); // true

        // ISO_LOCAL_DATE always sorts correctly as plain text
        System.out.println(end.format(DateTimeFormatter.ISO_LOCAL_DATE)); // 2026-05-18
    }
}
```

`yyyy` is the year of the era and `YYYY` is the week based year, which disagrees with `MM` around
New Year. `MM` is the month and `mm` is the minute. Those two slips are cheap to make and hard
to see in a printed report.

### Example 5: A record that validates itself

```java
// File: GuestRecord.java
public class GuestRecord {
    // The compiler writes the constructor, accessors, equals, hashCode and toString.
    // Fields are private final and there is no setter.
    record Guest(String email, String city, int nights) {
        // A compact constructor checks and normalises before assignment.
        Guest {
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("bad email: " + email);
            }
            email = email.strip().toLowerCase();
            if (nights < 1) {
                throw new IllegalArgumentException("nights must be positive");
            }
        }

        // methods are fine, extra instance fields are not
        boolean longStay() {
            return nights >= 7;
        }

        // a static factory often reads better at the call site
        static Guest oneNight(String email) {
            return new Guest(email, "Budapest", 1);
        }
    }

    public static void main(String[] args) {
        Guest anna = new Guest("Anna@Example.com", "Budapest", 7);

        // the accessor has the component name, no get prefix
        System.out.println(anna.email());    // anna@example.com
        System.out.println(anna.longStay()); // true

        // equals compares every component, so it is data equality
        System.out.println(anna.equals(Guest.oneNight("anna@example.com"))); // false
        System.out.println(anna.equals(new Guest("anna@example.com", "Budapest", 7))); // true

        System.out.println(anna); // Guest[email=anna@example.com, city=Budapest, nights=7]

        // a bad value fails at construction, not later in the report
        try {
            Guest.oneNight("not-an-email");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage()); // bad email: not-an-email
        }
    }
}
```

Records work well as map keys and list elements because `equals` and `hashCode` come for free.
A record with an array component is the exception: the generated `equals` compares array
references, so two records with equal contents still differ.

### Example 6: Scanner without the nextLine trap

```java
// File: ParseInput.java
import java.util.Scanner;

public class ParseInput {
    public static void main(String[] args) {
        String data = "3 12 7\n4 5 9\n";

        // Scanner reads whitespace separated tokens, not lines
        Scanner scanner = new Scanner(data);
        int rows = scanner.nextInt();

        // hasNextInt guards the read, so trailing text does not throw
        int sum = 0;
        while (scanner.hasNextInt()) {
            sum += scanner.nextInt();
        }
        System.out.println(rows + " " + sum); // 3 37

        // next returns one token, nextLine returns the rest of the line
        Scanner lines = new Scanner("first line\nsecond line");
        System.out.println(lines.nextLine()); // first line
        System.out.println(lines.next());     // second

        // The trap: nextInt leaves the line break in the buffer, so a following
        // nextLine returns an empty string.
        Scanner trap = new Scanner("42\nAnna");
        int number = trap.nextInt();
        trap.nextLine();               // swallows the empty rest of that line
        String name = trap.nextLine();  // now the real line arrives
        System.out.println(number + " " + name);

        // close anything that wraps a file or a stream
        scanner.close();
        lines.close();
        trap.close();
    }
}
```

`Scanner` with `System.in` blocks until the input ends, which in a terminal means Ctrl D. In
an exam that reads a file, pass the `Path` to `Files.newBufferedReader` instead, or let
`Scanner(Path)` open the file.

### Example 7: An enum with fields and a switch

```java
// File: RoomTypeDemo.java
public class RoomTypeDemo {
    // An enum is a class with a fixed set of instances.
    enum RoomType {
        SINGLE(1, 80),
        DOUBLE(2, 120),
        SUITE(4, 260);

        private final int beds;
        private final int basePrice;

        // the constructor is implicitly private
        RoomType(int beds, int basePrice) {
            this.beds = beds;
            this.basePrice = basePrice;
        }

        int priceFor(int nights) {
            return basePrice * nights;
        }

        // a lookup that fails with a clear message instead of returning null
        static RoomType fromCode(String code) {
            for (RoomType type : values()) {
                if (type.name().equalsIgnoreCase(code)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("unknown room type: " + code);
        }
    }

    public static void main(String[] args) {
        RoomType type = RoomType.fromCode("double");
        System.out.println(type);              // DOUBLE
        System.out.println(type.ordinal());    // 1, position in the declaration
        System.out.println(type.priceFor(3));  // 360

        // exhaustive over the constants, so no default is needed
        String label = switch (type) {
            case SINGLE -> "one bed";
            case DOUBLE -> "two beds";
            case SUITE -> "two rooms";
        };
        System.out.println(label); // two beds

        // valueOf throws on an unknown name, fromCode controls the message
        System.out.println(RoomType.valueOf("SUITE") == RoomType.SUITE); // true
    }
}
```

`ordinal()` is a position, not a database value. Store `name()` or a dedicated code field in a
file, because reordering the constants silently changes every ordinal.

### Example 8: A generic method and a bounded type parameter

```java
// File: Ranking.java
import java.util.ArrayList;
import java.util.List;

public class Ranking {
    // The bound Comparable<T> is what allows the compareTo call.
    static <T extends Comparable<T>> T max(List<T> items) {
        T best = items.get(0);
        for (T item : items) {
            if (item.compareTo(best) > 0) {
                best = item;
            }
        }
        return best;
    }

    // A generic class keeps its element type through every method.
    static class Box<T> {
        private final List<T> items = new ArrayList<>();

        void add(T item) {
            items.add(item);
        }

        T first() {
            return items.get(0);
        }

        // ? extends Number accepts List<Integer> and List<Double> for reading
        static double total(List<? extends Number> numbers) {
            double sum = 0;
            for (Number number : numbers) {
                sum += number.doubleValue();
            }
            return sum;
        }
    }

    public static void main(String[] args) {
        System.out.println(max(List.of("Eger", "Budapest", "Debrecen"))); // Eger
        System.out.println(max(List.of(4, 19, 7)));                        // 19

        Box<String> cities = new Box<>();
        cities.add("Gyor");
        System.out.println(cities.first()); // Gyor

        System.out.println(Box.total(List.of(1, 2, 3)));  // 6.0
        System.out.println(Box.total(List.of(1.5, 2.5))); // 4.0

        // primitives cannot be type arguments, autoboxing supplies Integer
        Box<Integer> counts = new Box<>();
        counts.add(3);
        System.out.println(counts.first() + 1); // 4
    }
}
```

`? extends Number` is a read-only view. Adding to a `List<? extends Number>` is a compile error,
because the compiler cannot know whether the list holds `Integer` or `Double`. Use
`List<? super Integer>` when a method writes.

### Example 9: Threads, a pool, and a lock

```java
// File: CounterDemo.java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class CounterDemo {
    // Two threads doing value++ lose updates without a lock, because ++ is
    // read, add, write in three steps.
    static class Counter {
        private int value;

        synchronized void increment() {
            value++;
        }

        synchronized int get() {
            return value;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();

        // Two threads run 1000 tasks, so the increments overlap
        ExecutorService pool = Executors.newFixedThreadPool(2);
        for (int i = 0; i < 1000; i++) {
            pool.submit(counter::increment);
        }

        // shutdown refuses new tasks, awaitTermination waits for the running ones
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println(counter.get()); // 1000

        // A plain Thread is enough for one background job
        Thread worker = new Thread(() -> System.out.println("worker done"));
        worker.start();

        // join blocks the caller until that thread ends
        worker.join();
        System.out.println("main done");
    }
}
```

The order of the two last lines is fixed by `join`, and the counter is fixed by `synchronized`.
Remove either and the output becomes a race that passes on a fast machine and fails in the exam.

### Example 10: Lambdas and a comparator chain

```java
// File: SortGuests.java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

public class SortGuests {
    record Guest(String name, int nights) {}

    // A functional interface has exactly one abstract method, so a lambda fits it.
    interface Formatter {
        String apply(Guest guest);

        // default methods do not count towards the single abstract method
        default String upper(Guest guest) {
            return apply(guest).toUpperCase();
        }
    }

    public static void main(String[] args) {
        List<Guest> guests = new ArrayList<>(List.of(
            new Guest("Anna", 7),
            new Guest("Bela", 2),
            new Guest("Csilla", 7)
        ));

        // comparing takes a key, thenComparing breaks ties
        guests.sort(Comparator.comparing(Guest::nights).reversed()
                              .thenComparing(Guest::name));

        // forEach takes a Consumer
        guests.forEach(g -> System.out.println(g.name() + " " + g.nights()));

        // a Predicate is a reusable condition, negate flips it
        Predicate<Guest> longStay = g -> g.nights() >= 7;
        guests.removeIf(longStay.negate());
        System.out.println(guests.size()); // 2

        // the lambda is the only abstract method of the interface
        Formatter formatter = g -> g.name() + " (" + g.nights() + ")";
        System.out.println(formatter.upper(guests.get(0))); // ANNA (7)

        // a method reference is a lambda whose body calls one existing method
        Runnable task = () -> System.out.println("done");
        task.run();
    }
}
```

A lambda can read a local variable only if it is effectively final. Reassigning the variable
after the lambda is written breaks compilation, and the error points at the lambda, not at the
assignment.

### Example 11: Count with a map, reject duplicates with a set

```java
// File: CityTally.java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CityTally {
    public static void main(String[] args) {
        List<String> emails = List.of(
            "anna@example.com", "bela@example.com", "anna@example.com");

        Map<String, Integer> byCity = new HashMap<>();
        Set<String> seen = new HashSet<>();

        // merge is the counting idiom: absent key becomes 1, present key adds
        byCity.merge("Budapest", 1, Integer::sum);
        byCity.merge("Eger", 1, Integer::sum);
        byCity.merge("Budapest", 1, Integer::sum);

        // add returns false when the value is already present
        for (String email : emails) {
            if (!seen.add(email)) {
                System.out.println("duplicate: " + email); // duplicate: anna@example.com
            }
        }

        // get returns null for a missing key, getOrDefault avoids the check
        System.out.println(byCity.getOrDefault("Szeged", 0)); // 0

        // entrySet is the way to walk keys and values together
        for (Map.Entry<String, Integer> entry : byCity.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
        }

        // a map has no order, so sorting means sorting its entries into a list
        List<Map.Entry<String, Integer>> rows = new ArrayList<>(byCity.entrySet());
        rows.sort(Map.Entry.<String, Integer>comparingByValue().reversed());
        System.out.println(rows.get(0).getKey()); // Budapest

        // containsKey tells a missing key from a key mapped to null
        System.out.println(byCity.containsKey("Eger")); // true
        System.out.println(seen.size());                // 2
    }
}
```

`HashMap` prints in an order that no one promised. Do not test a report by comparing
`map.toString()`; walk `entrySet()` in a known order, or sort the entries first.

### Example 12: try-with-resources around a file

```java
// File: ReportFile.java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ReportFile {
    public static void main(String[] args) {
        Path file = Path.of("report.txt");

        // Resources in the parentheses close at the end of the block, in reverse
        // order, even when the body throws. Both must be AutoCloseable.
        try (BufferedWriter writer = Files.newBufferedWriter(file)) {
            writer.write("Budapest 3");
            writer.newLine();
            writer.write("Eger 2");
            writer.newLine();
        } catch (IOException e) {
            System.out.println("write failed: " + e.getMessage());
            return;
        }

        // A second block reads it back one line at a time
        int total = 0;
        try (BufferedReader reader = Files.newBufferedReader(file)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(" ");
                total += Integer.parseInt(parts[1]);
            }
        } catch (IOException | NumberFormatException e) {
            System.out.println("read failed: " + e.getMessage());
        }
        System.out.println(total); // 5

        // the Files helpers open and close the stream themselves
        try {
            List<String> lines = Files.readAllLines(file);
            System.out.println(lines.size()); // 2
        } catch (IOException e) {
            System.out.println("read failed: " + e.getMessage());
        }

        // a close that also throws is attached as a suppressed exception
        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            System.out.println("cleanup failed: " + e.getMessage());
        }
    }
}
```

A `finally` block that calls `close` is the old form and it loses the original exception when
close throws. The parentheses after `try` keep both, and the suppressed one is reachable through
`getSuppressed()`.

### Example 13: var and a switch expression

```java
// File: PriceSwitch.java
import java.util.ArrayList;

public class PriceSwitch {
    sealed interface Stay permits Short, Long {}

    record Short(int nights) implements Stay {}
    record Long(int nights) implements Stay {}

    // var is only for locals with an initialiser. The type is fixed at
    // compile time, so the compiler still knows this is a String.
    static String classify(Stay stay) {
        // The switch is a value. Over a sealed type it must cover every case,
        // and a guard narrows one case further.
        return switch (stay) {
            case Short s when s.nights() <= 2 -> "weekend";
            case Short s -> "short stay of " + s.nights();
            case Long l -> "long stay of " + l.nights();
        };
    }

    public static void main(String[] args) {
        // var removes the repeated type, the diamond stays on the right
        var hotels = new ArrayList<String>();
        hotels.add("Danube View");

        // var in a for each loop takes the element type
        for (var hotel : hotels) {
            System.out.println(hotel.length()); // 11
        }

        // an int switch has no ranges, but several labels per branch
        int nights = 5;
        String band = switch (nights) {
            case 1, 2 -> "weekend";
            case 3, 4, 5 -> {
                String label = "midweek";
                yield label; // a block case returns with yield
            }
            default -> "long";
        };
        System.out.println(band); // midweek

        System.out.println(classify(new Short(2))); // weekend
        System.out.println(classify(new Long(9)));  // long stay of 9

        // var does not make the variable dynamic, this would not compile:
        // var count = 0; count = "zero";
        var total = 0;
        total += 3;
        System.out.println(total); // 3
    }
}
```

The arrow form has no fallthrough, so a missing `break` cannot leak into the next case. A switch
expression that misses an enum constant is a compile error, which is the main reason to prefer
it over the statement form in a report.

### Example 14: The booking desk, one program

This one is long on purpose. It reads rows, validates them with a record, counts with a map,
rejects duplicates with a set, sorts with an array and a comparator, formats dates, and writes a
file with try-with-resources.

```java
// File: Desk.java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

public class Desk {
    // The row shape. Validation lives in the compact constructor, so an
    // invalid row cannot reach the rest of the program.
    record Booking(String email, String city, Room room, LocalDate start, int nights) {
        Booking {
            if (nights < 1) {
                throw new IllegalArgumentException("nights: " + nights);
            }
            email = email.strip().toLowerCase(Locale.ROOT);
        }

        LocalDate end() {
            return start.plusDays(nights);
        }
    }

    // An enum carries the price, so no lookup table and no typo in a string.
    enum Room {
        SINGLE(80),
        DOUBLE(120),
        SUITE(260);

        private final int price;

        Room(int price) {
            this.price = price;
        }

        int total(int nights) {
            return price * nights;
        }
    }

    public static void main(String[] args) throws IOException {
        // The exam hands you lines, so a text block stands in for the file
        String input = """
                anna@example.com;Budapest;DOUBLE;2026-05-11;3
                bela@example.com;Eger;SINGLE;2026-05-12;1
                csilla@example.com;Budapest;SUITE;2026-05-11;7
                anna@example.com;Budapest;DOUBLE;2026-06-01;2
                """;

        List<Booking> bookings = new ArrayList<>();
        // Scanner over a string, closed by try-with-resources like any stream
        try (Scanner rows = new Scanner(input)) {
            while (rows.hasNextLine()) {
                String line = rows.nextLine().strip();
                if (line.isEmpty()) {
                    continue; // blank line between blocks
                }
                String[] parts = line.split(";");
                bookings.add(new Booking(
                        parts[0],
                        parts[1],
                        Room.valueOf(parts[2]),
                        LocalDate.parse(parts[3]),
                        Integer.parseInt(parts[4])));
            }
        }

        // HashSet: who booked, counted once even with repeat guests
        Set<String> guests = new HashSet<>();
        for (Booking booking : bookings) {
            guests.add(booking.email());
        }

        // HashMap: revenue per city, merge does the absent key case
        Map<String, Integer> revenue = new HashMap<>();
        for (Booking booking : bookings) {
            revenue.merge(booking.city(),
                    booking.room().total(booking.nights()),
                    Integer::sum);
        }

        // Arrays.sort on the fixed keys, then a comparator chain on objects
        String[] cities = revenue.keySet().toArray(new String[0]);
        Arrays.sort(cities);
        bookings.sort(Comparator.comparing(Booking::start)
                .thenComparing(Booking::email));

        DateTimeFormatter display =
                DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
        StringBuilder report = new StringBuilder();
        report.append("bookings: ").append(bookings.size()).append('\n');

        // String.format keeps the columns aligned in a monospaced terminal
        for (Booking booking : bookings) {
            report.append(String.format("%-20s %-9s %s to %s (%d night%s)%n",
                    booking.email(),
                    booking.city(),
                    booking.start().format(display),
                    booking.end().format(display),
                    booking.nights(),
                    booking.nights() == 1 ? "" : "s"));
        }

        // A switch expression over the bucket, with the bands named once
        for (String city : cities) {
            int amount = revenue.get(city);
            String size = switch (amount / 100) {
                case 0, 1 -> "small";
                case 2, 3, 4 -> "medium";
                default -> "large";
            };
            report.append(city).append(": ").append(amount)
                  .append(" (").append(size).append(")\n");
        }

        long nights = bookings.stream().mapToLong(Booking::nights).sum();
        report.append("guests: ").append(guests.size())
              .append(", nights: ").append(nights).append('\n');

        // Write it, then read it back to prove the bytes landed
        Path out = Path.of("desk-report.txt");
        try (BufferedWriter writer = Files.newBufferedWriter(out)) {
            writer.write(report.toString());
        }
        System.out.print(report);
        System.out.println(Files.readString(out).lines().count() + " lines written");
    }
}
```

Read it in this order: input, parse, aggregate, sort, format, write. Every section is a loop over
the same list, and no section needs the previous one to be clever. That is what makes the shape
reliable when the clock is running.

Expected output, with the columns padded by `String.format`:

```text
bookings: 4
anna@example.com     Budapest  11 May 2026 to 14 May 2026 (3 nights)
csilla@example.com   Budapest  11 May 2026 to 18 May 2026 (7 nights)
bela@example.com     Eger      12 May 2026 to 13 May 2026 (1 night)
anna@example.com     Budapest  01 Jun 2026 to 03 Jun 2026 (2 nights)
Budapest: 2420 (large)
Eger: 80 (small)
guests: 3, nights: 13
8 lines written
```

The dates come from the formatter and the totals from `merge`. If your output differs in order,
check the comparator before checking the map.

## Common mistakes

- Comparing strings with `==`. It compares references, and interning makes simple literals pass
  by accident, so the bug appears only for strings built at run time.
- Calling `split(".")` and getting an empty array. The argument is a regex, where `.` matches any
  character. Escape it as `\\.` or use `Pattern.quote`.
- Building a long string with `+=` inside a loop and wondering why the program crawls. Use
  `StringBuilder`, then call `toString` once.
- Forgetting that `List.of` is immutable. `add` throws `UnsupportedOperationException`, and
  `new ArrayList<>(List.of(...))` is the writable copy.
- Expecting `Arrays.sort` on an `int[]` to sort descending with a comparator. Primitive arrays
  take no comparator. Sort ascending and reverse, or use an `Integer[]`.
- Calling `binarySearch` on an unsorted array. The result is a wrong index, not an exception.
- Writing `array1 == array2` or `array1.equals(array2)` and expecting content equality. Use
  `Arrays.equals`, and `Arrays.deepEquals` for nested arrays.
- Using `YYYY` instead of `yyyy`, or `mm` instead of `MM`. The first is the week year, the second
  is minutes, and both produce plausible looking wrong output.
- Forgetting `Locale.ENGLISH` on a formatter with `MMM`. The month name follows the machine
  locale, so the exam machine can print a different word.
- Expecting a record to be mutable, or to have a `setEmail` method. There is no setter, and the
  field is final. Create a new record instead.
- Declaring an extra instance field in a record. Only static fields are allowed inside a record
  body, because the component list defines the state.
- Calling `nextLine` after `nextInt` and getting an empty string. Consume the leftover line, or
  read every line with `nextLine` and parse it yourself.
- Calling `run()` instead of `start()` on a `Thread`. `run` executes on the current thread, so
  the program looks correct and is not concurrent.
- Sharing an `int` counter between threads without `synchronized`, `AtomicInteger`, or a lock.
  Some increments disappear, and the count is short by a number that changes per run.
- Using a mutable object as a `HashMap` key and changing a field used by `hashCode`. The entry
  stays in the map but no lookup can reach it.
- Assuming `HashMap` or `HashSet` keeps insertion order. Use `LinkedHashMap` when order matters
  and `TreeMap` when sorted keys matter.
- Opening a `BufferedReader` and never closing it, or closing it in `finally` and losing the
  original exception. Put it in the `try` parentheses.
- Writing `var` for a field or a parameter. It compiles only for local variables with an
  initialiser on the same line.
- Adding `default` to a switch expression over an enum just to silence the compiler. It hides
  the error that appears when a new constant is added.
- Mixing `yield` into the arrow form without a block. A single expression case returns the
  expression; `yield` belongs inside `{ }`.

## Exam checklist

1. Can you split a line on a semicolon, strip each field, parse an `int`, and print a formatted
   row with `printf`?
2. Can you say why `String` concatenation in a loop is slower than `StringBuilder`, and write
   both versions?
3. Can you sort an `int[]`, search it with `binarySearch`, and explain what a negative result
   means?
4. Can you copy an array to a longer length and predict the padding value?
5. Can you parse `2026-05-11`, add 7 days, and print it as `18 May 2026` with a fixed locale?
6. Can you compute the number of nights between two dates with `ChronoUnit` and with `Period`?
7. Can you write a record with a compact constructor that rejects a bad email and lowercases a
   good one?
8. Can you write a `Scanner` loop that reads integers until the tokens run out, and explain the
   `nextInt` then `nextLine` trap?
9. Can you declare an enum with a price field, a method, and an exhaustive switch expression?
10. Can you write a generic method with a `Comparable` bound and say why the bound is required?
11. Can you start a thread, join it, and explain the difference between `start` and `run`?
12. Can you count occurrences in a `HashMap` with `merge` and detect duplicates with a
    `HashSet`?
13. Can you sort a list of records by two keys, one of them descending?
14. Can you read a file line by line and write one back with try-with-resources, and say which
    exception wins when both the body and `close` throw?
15. Can you write a switch expression with `yield`, a `when` guard, and a record pattern, and
    say when a `default` is required?
