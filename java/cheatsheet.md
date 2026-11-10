# Java console cheat sheet

The exam console task is mostly file reading, parsing, collections, and one output file. Keep the program in one class with a `main` method and small static helpers. That is faster to write and easier to debug than a layered design.

## Compile and run

```bash
javac BookingsCli.java
java BookingsCli bookings.csv
```

If the program uses a database driver, add the jar to the classpath:

```bash
java -cp .:mysql-connector-j-8.4.0.jar BookingsCli
```

On Windows the separator is `;` instead of `:`.

## Skeleton

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class BookingsCli {

    public static void main(String[] args) throws IOException {
        if (args.length == 0) {
            System.out.println("Usage: java BookingsCli bookings.csv");
            return;
        }

        List<String> lines = Files.readAllLines(Path.of(args[0]));
        System.out.println("Rows: " + lines.size());
    }
}
```

`throws IOException` on `main` is fine for an exam. The JVM prints the stack trace, which tells you the missing file or the permission problem.

## Read a file

```java
// Whole file into memory. Fine for exam sized CSV files.
List<String> lines = Files.readAllLines(Path.of("bookings.csv"));

// Line by line. Use this when the file may be large.
try (var reader = Files.newBufferedReader(Path.of("bookings.csv"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

`Files.readAllLines` uses UTF-8 by default in Java 18 and later. On older versions, pass `StandardCharsets.UTF_8`.

## CSV parsing

Most exam CSV files are simple: comma separated, no quoted commas. `split(",", -1)` keeps empty trailing fields, which matters when the last column is empty.

```java
static String[] parseCsvLine(String line) {
    return line.split(",", -1);
}

static String get(String[] fields, int index) {
    return index < fields.length ? fields[index].trim() : "";
}
```

If a field can contain a comma inside quotes, use the full parser from `java/BookingsCli.java`. Do not write a new one under time pressure.

The header row may be present. Detect it by looking at the first field:

```java
int start = lines.isEmpty() ? 0 : 1;

String first = lines.get(0).split(",", -1)[0].trim();
if (!first.equals("customer_email")) {
    start = 0;
}
```

## Numbers and dates

```java
int adults = Integer.parseInt(get(fields, 9));
int children = Integer.parseInt(get(fields, 10));

// Empty numeric field: use a default instead of throwing.
int count = get(fields, 10).isEmpty() ? 0 : Integer.parseInt(get(fields, 10));

LocalDate start = LocalDate.parse(get(fields, 12)); // yyyy-MM-dd
LocalDate end = LocalDate.parse(get(fields, 13));
long nights = ChronoUnit.DAYS.between(start, end);
```

`LocalDate.parse` throws `DateTimeParseException` on a bad value. For an exam, let it throw and fix the data, or wrap it:

```java
static LocalDate dateOrNull(String text) {
    try {
        return LocalDate.parse(text.trim());
    } catch (DateTimeParseException e) {
        return null;
    }
}
```

## Record for one row

```java
record Booking(
    String customerEmail,
    int hotelId,
    LocalDate startDate,
    LocalDate endDate,
    int adults,
    int children,
    int boylovers
) {
    long nights() {
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    int guests() {
        return adults + children + boylovers;
    }
}
```

Records give you the constructor, accessors, `equals`, `hashCode`, and `toString` for free. Accessors are `b.startDate()`, not `b.getStartDate()`.

## Lists

```java
List<Booking> bookings = new ArrayList<>();

for (String line : lines) {
    String[] f = parseCsvLine(line);
    bookings.add(new Booking(
        get(f, 0),
        Integer.parseInt(get(f, 6)),
        LocalDate.parse(get(f, 12)),
        LocalDate.parse(get(f, 13)),
        Integer.parseInt(get(f, 14)),
        Integer.parseInt(get(f, 15)),
        Integer.parseInt(get(f, 16))
    ));
}

System.out.println("Bookings: " + bookings.size());
```

Use `List.of(...)` only for a fixed list. It is immutable, so `add` throws `UnsupportedOperationException`.

## Filter, sort, max

```java
// Filter
List<Booking> in2024 = bookings.stream()
    .filter(b -> b.startDate().getYear() == 2024)
    .toList();

// Sort by nights, longest first
List<Booking> byNights = new ArrayList<>(bookings);
byNights.sort(Comparator.comparingLong(Booking::nights).reversed());

// Longest booking
Booking longest = bookings.stream()
    .max(Comparator.comparingLong(Booking::nights))
    .orElse(null);

if (longest != null) {
    System.out.println(longest.customerEmail() + " " + longest.nights());
}

// Sort by two fields
bookings.sort(
    Comparator.comparing(Booking::startDate)
        .thenComparing(Booking::customerEmail)
);
```

`Comparator.comparingLong` avoids boxing. For a `String` key, use `Comparator.comparing(Booking::customerEmail)`.

## Distinct values and random pick

```java
List<String> emails = bookings.stream()
    .map(Booking::customerEmail)
    .distinct()
    .sorted()
    .toList();

Random random = new Random();
String picked = emails.get(random.nextInt(emails.size()));
```

Guard the empty list before calling `random.nextInt(0)`.

## Group and count

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

## Sum and average

```java
int totalGuests = bookings.stream().mapToInt(Booking::guests).sum();

double averageNights = bookings.stream()
    .mapToLong(Booking::nights)
    .average()
    .orElse(0);

System.out.printf(Locale.US, "Average: %.2f%n", averageNights);
```

Use `Locale.US` when the expected output uses a dot. Hungarian locale prints a comma.

## Word count

```java
static int wordCount(String text) {
    String trimmed = text == null ? "" : text.trim();
    if (trimmed.isEmpty()) {
        return 0;
    }
    return trimmed.split("\\s+").length;
}
```

This counts whitespace separated words. Punctuation stays attached, which is usually what the exam expects.

## Write a file

```java
List<String> output = bookings.stream()
    .filter(b -> b.nights() < 3)
    .map(b -> b.customerEmail() + "," + b.hotelId() + "," + b.nights())
    .toList();

Files.write(Path.of("rovidek.txt"), output);
```

`Files.write` creates or overwrites the file. Add `StandardOpenOption.APPEND` to append:

```java
Files.write(path, output, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

Build lines with `StringBuilder` when the format is more complex:

```java
StringBuilder sb = new StringBuilder();
for (Booking b : bookings) {
    sb.append(b.customerEmail())
      .append(";")
      .append(b.nights())
      .append(System.lineSeparator());
}
Files.writeString(Path.of("out.txt"), sb.toString());
```

## String helpers

```java
String text = "  Hotel Danube  ";
text.trim();                 // "Hotel Danube"
text.strip();                // Unicode aware trim, Java 11+
text.isBlank();              // true for spaces only
text.toLowerCase();          // locale sensitive
text.toUpperCase(Locale.ROOT);
text.contains("Danube");
text.startsWith("Hotel");
text.substring(0, 5);
text.replace("a", "b");
String.join(", ", List.of("a", "b"));
```

Use `Locale.ROOT` for case changes that must not depend on the machine language.

## Scanner input

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Hotel id: ");
int id = Integer.parseInt(scanner.nextLine().trim());
```

Read the whole line with `nextLine`, then parse. Mixing `nextInt` and `nextLine` leaves the newline in the buffer, which causes the next read to return an empty string.

## Exceptions

```java
try {
    int value = Integer.parseInt(text);
    System.out.println(value);
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + text);
}
```

For file work, try with resources closes the reader even when an exception is thrown:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line;
    while ((line = reader.readLine()) != null) {
        // ...
    }
} catch (IOException e) {
    System.out.println("Could not read " + path + ": " + e.getMessage());
}
```

## JDBC quick start

```java
String url = "jdbc:mysql://localhost:3306/bookings?useSSL=false&serverTimezone=UTC";
try (Connection conn = DriverManager.getConnection(url, "root", "password");
     PreparedStatement ps = conn.prepareStatement(
         "SELECT name, stars FROM hotels WHERE city = ? ORDER BY name")) {

    ps.setString(1, "Budapest");

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("name") + " " + rs.getInt("stars"));
        }
    }
}
```

Always use `?` placeholders for user input. String concatenation opens SQL injection.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `ArrayIndexOutOfBoundsException` | A row has fewer columns than expected | Use `get(fields, index)` with a bounds check |
| `NumberFormatException` | Empty or quoted numeric field | Trim, check `isEmpty`, strip quotes |
| `DateTimeParseException` | Date is not `yyyy-MM-dd` | Print the bad value before parsing |
| `NullPointerException` | A missing field or a null result | Guard with `isEmpty` or `Optional` |
| `UnsupportedOperationException` | `List.of` was modified | Copy into `new ArrayList<>(...)` |
| `NoSuchFileException` | Wrong relative path | Print `Path.of(...).toAbsolutePath()` |
| `ClassNotFoundException` | JDBC driver missing from classpath | Add the connector jar |
| Output has a trailing comma | Join logic adds a separator after every item | Join with `String.join` or skip the last separator |

## Exam checklist

1. Read the whole task before typing.
2. Print the row count first. If that is wrong, nothing else matters.
3. Parse one row and print it. Then loop.
4. Handle the header and empty fields.
5. Finish the easy points before the hard ones.
6. Write the output file last, and print its path.
7. Run the program after every task, not at the end.
