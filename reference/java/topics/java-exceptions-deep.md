# Java exceptions

Java topic · Exam Wiki

## Simplest form

```java
// Data shape: try { risky(); } catch (SomeException e) { recover(e); } finally { cleanup(); }
// e.getMessage() is a String or null, e.getCause() is a Throwable or null,
// e.getStackTrace() is an array of StackTraceElement.
try {
    int nights = Integer.parseInt(nightsText);
    System.out.println("nights: " + nights);
} catch (NumberFormatException e) {
    System.out.println("not a number: " + nightsText);
}
```

## What it does

An exception is an object that carries a failure out of the method where it happened. The JVM creates it at the `throw` point, fills in the stack trace, and unwinds the call stack until some `catch` accepts it. If nothing accepts it, the thread dies and the default handler prints the trace.

The object matters more than the keyword. Every exception has a type, an optional message, an optional cause, and a stack trace. The type decides who is forced to handle it. The message is for the human reading the log. The cause keeps the original failure when you translate one exception into another.

## The hierarchy

`Throwable` sits at the top. Below it are two branches.

- `Error` covers problems the application should not try to recover from, such as `OutOfMemoryError` or `StackOverflowError`.
- `Exception` covers ordinary failures. Its subtree splits again into checked exceptions and unchecked ones.

`RuntimeException` and its subclasses are unchecked: `NullPointerException`, `IllegalArgumentException`, `IllegalStateException`, `NumberFormatException`, `IndexOutOfBoundsException`, `ClassCastException`, `ArithmeticException`, `UnsupportedOperationException`. The compiler does not require a catch or a `throws` clause for them.

Everything else under `Exception` is checked: `IOException`, `FileNotFoundException`, `SQLException`, `ParseException`, `InterruptedException`. The compiler forces the caller to either catch it or declare it.

A quick way to remember the rule: if the failure comes from the outside world (disk, network, database, another process), Java usually made it checked. If the failure comes from a bug in your own code (bad argument, null, wrong index), it is unchecked.

## Every part

### try

A `try` block marks code whose failure you want to intercept. It needs at least one `catch` or a `finally`, or it must be a try-with-resources.

The block itself does nothing special. It only defines the region the handlers protect.

### catch

Handlers are tested in the order written. The first matching type wins. A `catch (Exception e)` placed before `catch (IOException e)` makes the second clause a compile error, because the broader type already caught everything the narrow one could.

The parameter is effectively final in Java 7 and later when you use multi-catch. You can still read it, log it, wrap it, or rethrow it.

```java
try {
    load(path);
} catch (FileNotFoundException e) {
    System.out.println("missing file: " + path);
} catch (IOException e) {
    System.out.println("read failed: " + e.getMessage());
}
```

### Multi-catch

When two unrelated exception types need the same handling, join them with `|`.

```java
try {
    Booking booking = parse(line);
    save(booking);
} catch (NumberFormatException | DateTimeParseException e) {
    // Both mean the row is malformed, so one message is enough.
    System.out.println("bad row: " + line);
}
```

The alternatives cannot be subclasses of one another. The variable's type becomes the closest common supertype, so you can call only methods that exist on both.

### finally

`finally` runs when the try block exits for any reason: normal completion, a caught exception, an uncaught exception, `return`, `break`, or `continue`. That makes it the place for cleanup that must happen even when the method leaves early.

```java
Scanner scanner = new Scanner(System.in);
try {
    System.out.print("customer_email: ");
    String email = scanner.nextLine();
    System.out.println("got " + email);
} finally {
    scanner.close();
}
```

Two traps live here. A `return` inside `finally` discards the pending exception and any earlier return value, which hides failures. And `System.exit(0)` skips `finally` blocks because the JVM shuts down instead of unwinding.

```java
static int broken() {
    try {
        return 1;
    } finally {
        return 2; // Always 2. The 1 disappears, and an exception from try would disappear too.
    }
}
```

There is also an ordering detail worth knowing: if both the try block and the finally block throw, the finally exception replaces the first one. The original is lost unless you attach it as a cause.

### throw and throws

`throw` raises an exception object. `throws` appears in a method signature and lists the checked exceptions the method may pass upward.

```java
static void validateStars(int stars) {
    if (stars < 1 || stars > 5) {
        throw new IllegalArgumentException("stars must be 1..5, got " + stars);
    }
}

static List<Booking> readAll(Path file) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(file)) {
        return parseAll(reader);
    }
}
```

A method that declares `throws IOException` pushes the decision to its caller. That is not laziness when the caller has better context. It is laziness when every caller ends up writing the same empty catch.

### try-with-resources

Any object that implements `AutoCloseable` can be declared in the parentheses. Java closes it when the block ends, even on exception, and closes multiple resources in reverse declaration order.

```java
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {
        System.out.println(rs.getString("name"));
    }
}
```

The compiler expands this into nested try/finally blocks, so the close calls happen before any `catch` or `finally` you write on the same statement. Declare resources in the order you acquire them. The last one declared is the first one closed, which is exactly what a `ResultSet`, then `Statement`, then `Connection` sequence needs.

Java 9 added a second form for variables that are already declared and effectively final:

```java
BufferedReader reader = Files.newBufferedReader(path);
try (reader) {
    System.out.println(reader.readLine());
}
```

Use try-with-resources whenever the resource type allows it. Write a manual finally only for resources that do not implement `AutoCloseable`, or when the close call needs extra arguments.

### Suppressed exceptions

Closing can fail too. When the body throws and `close()` also throws, the body exception stays primary and the close exception is attached to it as suppressed. `Throwable.getSuppressed()` returns them.

This is the main reason try-with-resources beats a hand-written finally. A manual close inside finally would replace the original failure with the close failure, and the real cause would vanish.

```java
try (FailingClose first = new FailingClose("first");
     FailingClose second = new FailingClose("second")) {
    throw new IllegalStateException("body failed");
} catch (Exception e) {
    System.out.println("primary: " + e);
    for (Throwable suppressed : e.getSuppressed()) {
        System.out.println("suppressed: " + suppressed);
    }
}
```

If the body succeeds and one close fails, the first close failure becomes primary and later close failures become suppressed on it.

### Custom exceptions

Write your own type when the caller needs to distinguish the failure, or when the exception should carry data. Extending `Exception` makes it checked. Extending `RuntimeException` makes it unchecked, which is usually right for programming errors and wrong input.

```java
public class InsufficientStarsException extends Exception {
    private final int hotelId;

    public InsufficientStarsException(int hotelId, String message) {
        super(message);
        this.hotelId = hotelId;
    }

    public int hotelId() {
        return hotelId;
    }
}
```

Give the class at least a message constructor and a message plus cause constructor. Add fields only when a handler will actually read them. A custom exception with no behavior is often just noise.

### Wrapping and cause

Translation is normal at layer boundaries. The repository catches `SQLException` and throws a domain exception, but keeps the original as the cause.

```java
try {
    return queryBookings(city);
} catch (SQLException e) {
    throw new BookingStoreException("cannot load bookings for " + city, e);
}
```

`getCause()` returns the original, `printStackTrace()` prints the whole chain, and log frameworks show it too. Losing the cause turns a five minute bug into an hour of guessing.

## Examples

### Example 1: recover from bad input

```java
import java.util.Scanner;

public class StarsInput {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.print("stars (1-5): ");
            String text = scanner.nextLine().trim();

            try {
                int stars = Integer.parseInt(text);
                if (stars < 1 || stars > 5) {
                    // Valid number, invalid range: a different failure, handled below.
                    throw new IllegalArgumentException("out of range");
                }
                System.out.println("accepted " + stars);
                break;
            } catch (NumberFormatException e) {
                System.out.println("'" + text + "' is not a whole number");
            } catch (IllegalArgumentException e) {
                System.out.println("stars must be between 1 and 5");
            }
        }

        scanner.close();
    }
}
```

The loop separates the two failure modes even though `NumberFormatException` is itself an `IllegalArgumentException`. Order matters: the narrower type comes first. Swap the clauses and the code stops compiling.

### Example 2: a checked exception that carries the bad line

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class LineReader {

    static class BadLineException extends Exception {
        private final int lineNumber;
        private final String rawLine;

        BadLineException(int lineNumber, String rawLine, String message, Throwable cause) {
            super("line " + lineNumber + ": " + message, cause);
            this.lineNumber = lineNumber;
            this.rawLine = rawLine;
        }

        int lineNumber() {
            return lineNumber;
        }

        String rawLine() {
            return rawLine;
        }
    }

    static int countColumns(Path file) throws BadLineException {
        try {
            List<String> lines = Files.readAllLines(file);
            if (lines.isEmpty()) {
                throw new BadLineException(0, "", "file is empty", null);
            }
            String header = lines.get(0);
            return header.split(",", -1).length;
        } catch (java.io.IOException e) {
            // IOException is checked and so is BadLineException, but the caller
            // only wants one failure type from this method.
            throw new BadLineException(0, "", "cannot read " + file, e);
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println("columns: " + countColumns(Path.of("bookings-sample.csv")));
        } catch (BadLineException e) {
            System.out.println(e.getMessage());
            System.out.println("raw: " + e.rawLine());
            if (e.getCause() != null) {
                System.out.println("cause: " + e.getCause().getMessage());
            }
        }
    }
}
```

Note the cause on the second throw. The `IOException` is not swallowed; it is demoted to `getCause()` while `BadLineException` becomes the method's contract.

### Example 3: close order and suppressed exceptions

```java
import java.io.IOException;

public class SuppressedDemo {

    static class LoudResource implements AutoCloseable {
        private final String name;
        private final boolean failOnClose;

        LoudResource(String name, boolean failOnClose) {
            this.name = name;
            this.failOnClose = failOnClose;
        }

        void use() {
            System.out.println("using " + name);
        }

        @Override
        public void close() throws IOException {
            System.out.println("closing " + name);
            if (failOnClose) {
                throw new IOException(name + " close failed");
            }
        }
    }

    public static void main(String[] args) {
        try (LoudResource first = new LoudResource("first", true);
             LoudResource second = new LoudResource("second", true)) {

            first.use();
            second.use();
            throw new IllegalStateException("body failed");

        } catch (Exception e) {
            System.out.println("primary: " + e);
            for (Throwable suppressed : e.getSuppressed()) {
                System.out.println("suppressed: " + suppressed);
            }
        }
    }
}
```

Output order: `second` closes before `first`, both close failures are suppressed, and `IllegalStateException` stays primary. That is the behavior a hand-written `finally` cannot give you without extra bookkeeping.

### Example 4: a large, fully commented import program

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads a booking CSV, validates each row, and reports the first bad row.
 *
 * Run:
 *   javac BookingImporter.java
 *   java BookingImporter bookings-sample.csv
 *
 * Columns used: customer_email, hotel_id, start_date, end_date, adults.
 * The header is skipped. A malformed row stops the import with a checked
 * exception that names the line, so the caller can show it to a human.
 */
public class BookingImporter {

    /** One valid row. A record keeps the example short without losing names. */
    record Booking(String customerEmail, int hotelId, LocalDate startDate,
                   LocalDate endDate, int adults) {

        long nights() {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }
    }

    /**
     * Checked on purpose: a bad file is an expected outcome of an import,
     * and the caller decides whether to skip the row or stop the run.
     */
    static class InvalidBookingException extends Exception {
        private final int lineNumber;
        private final String rawLine;

        InvalidBookingException(int lineNumber, String rawLine, String message, Throwable cause) {
            super("line " + lineNumber + ": " + message, cause);
            this.lineNumber = lineNumber;
            this.rawLine = rawLine;
        }

        int lineNumber() {
            return lineNumber;
        }

        String rawLine() {
            return rawLine;
        }
    }

    /** An AutoCloseable that records what it did, so close order is visible. */
    static class AuditLog implements AutoCloseable {
        private final String name;

        AuditLog(String name) {
            this.name = name;
        }

        void write(String line) {
            System.out.println(name + " <- " + line);
        }

        @Override
        public void close() {
            System.out.println(name + " closed");
        }
    }

    static List<Booking> read(Path file) throws IOException, InvalidBookingException {
        List<Booking> result = new ArrayList<>();
        int lineNumber = 1; // The header was line 1.

        // Two resources, closed in reverse order: audit first, reader second.
        try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8);
             AuditLog audit = new AuditLog("audit")) {

            String header = reader.readLine();
            if (header == null) {
                return result; // Empty file is not an error, just no rows.
            }

            String line;
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.isBlank()) {
                    continue;
                }
                result.add(parse(line, lineNumber));
                audit.write("ok " + lineNumber);
            }
        }

        return result;
    }

    static Booking parse(String line, int lineNumber) throws InvalidBookingException {
        String[] parts = line.split(",", -1);
        if (parts.length < 5) {
            throw new InvalidBookingException(lineNumber, line,
                    "expected at least 5 columns, got " + parts.length, null);
        }

        try {
            String email = parts[0].trim();
            int hotelId = Integer.parseInt(parts[1].trim());
            LocalDate start = LocalDate.parse(parts[2].trim());
            LocalDate end = LocalDate.parse(parts[3].trim());
            int adults = Integer.parseInt(parts[4].trim());

            if (email.isEmpty()) {
                throw new IllegalArgumentException("customer_email is empty");
            }
            if (end.isBefore(start)) {
                throw new IllegalArgumentException("end_date is before start_date");
            }
            if (adults < 1) {
                throw new IllegalArgumentException("adults must be at least 1");
            }

            return new Booking(email, hotelId, start, end, adults);
        } catch (NumberFormatException | DateTimeParseException e) {
            // Wrap the parser failure so the caller sees one domain type.
            throw new InvalidBookingException(lineNumber, line, "bad number or date", e);
        } catch (IllegalArgumentException e) {
            // Same idea for semantic errors, with no lower level cause.
            throw new InvalidBookingException(lineNumber, line, e.getMessage(), e);
        }
    }

    public static void main(String[] args) {
        Path file = Path.of(args.length > 0 ? args[0] : "bookings-sample.csv");

        try {
            List<Booking> bookings = read(file);
            System.out.println("read " + bookings.size() + " bookings");
            for (Booking booking : bookings) {
                System.out.println(booking.customerEmail() + " at hotel "
                        + booking.hotelId() + ": " + booking.nights() + " nights");
            }
        } catch (InvalidBookingException e) {
            System.out.println("import stopped: " + e.getMessage());
            System.out.println("offending line: " + e.rawLine());
            if (e.getCause() != null) {
                System.out.println("cause: " + e.getCause());
            }
        } catch (IOException e) {
            System.out.println("cannot read " + file + ": " + e.getMessage());
        } finally {
            // Runs for success, for a bad row, and for a missing file.
            System.out.println("import finished");
        }
    }
}
```

The control flow is the lesson. `parse` translates low level parser failures into one checked type. `read` owns the resources and lets both exception types escape. `main` is the only place that decides what the user sees, and `finally` handles the message that must always appear.

## More examples

The examples above cover one failure per call. Real code retries, validates a whole row, reads a trace, and cleans up objects that predate AutoCloseable. These five add those shapes, and each one is a complete file you can compile on its own.

### Example 5: bounded retry with logging

A retry loop is the place where exception types start to matter for real. `TransientStoreException` says another attempt may work. `StoreUnavailableException` says it will not, so the loop stops at once instead of burning attempts.

The `Action` interface exists because `Supplier` cannot throw checked exceptions. `retry` logs one line per failed attempt at `WARNING`, then throws a single `RetryFailedException` that keeps the last cause and the number of attempts. The caller logs that one record at `SEVERE` and decides what the user sees.

An `InterruptedException` arrives as a checked exception from `Thread.sleep`. Catching it, restoring the interrupt flag, and throwing an unchecked wrapper is the usual shape when the surrounding method cannot declare `throws InterruptedException`.

```java
// File: RetryWithLogging.java
// Data shape: retry(what, maxAttempts, action) returns T,
//            or throws RetryFailedException { attempts: int, cause: last failure }

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Bounded retry around an unreliable store.
 *
 * The point of the example: retry only failures that can heal by themselves,
 * log the attempt that failed, and keep the last cause when the run gives up.
 */
public class RetryWithLogging {

    private static final Logger LOG = Logger.getLogger(RetryWithLogging.class.getName());

    // Checked and retryable: the store hiccupped, the next call may work.
    static class TransientStoreException extends Exception {
        TransientStoreException(String message) {
            super(message);
        }
    }

    // Checked and final: another attempt would fail the same way.
    static class StoreUnavailableException extends Exception {
        StoreUnavailableException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // Supplier<T> cannot throw checked exceptions, so the action needs its own type.
    interface Action<T> {
        T run() throws TransientStoreException, StoreUnavailableException;
    }

    // The caller gets the attempt count, because it belongs in the one log line.
    static class RetryFailedException extends Exception {
        private final int attempts;

        RetryFailedException(String what, int attempts, Throwable cause) {
            super(what + " failed after " + attempts + " attempt(s)", cause);
            this.attempts = attempts;
        }

        int attempts() {
            return attempts;
        }
    }

    static <T> T retry(String what, int maxAttempts, Action<T> action) throws RetryFailedException {
        if (maxAttempts < 1) {
            // A caller bug, not a store failure: unchecked, so no signature noise.
            throw new IllegalArgumentException("maxAttempts must be at least 1, got " + maxAttempts);
        }

        TransientStoreException last = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return action.run();
            } catch (TransientStoreException e) {
                last = e;
                // One line per attempt. FINE would hide it, SEVERE would claim the run died.
                LOG.log(Level.WARNING, what + " attempt " + attempt + "/" + maxAttempts
                        + " failed: " + e.getMessage());
                if (attempt < maxAttempts) {
                    pause(20L * attempt); // Slightly longer wait each time.
                }
            } catch (StoreUnavailableException e) {
                // Retrying cannot help, so stop now and keep the original cause.
                throw new RetryFailedException(what, attempt, e);
            }
        }

        // The loop ended, so every attempt failed. `last` holds the newest failure.
        throw new RetryFailedException(what, maxAttempts, last);
    }

    static void pause(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            // Restore the flag first: the next blocking call has to see it.
            Thread.currentThread().interrupt();
            throw new IllegalStateException("retry paused and was interrupted", e);
        }
    }

    // A fake store: fails twice, then answers.
    static class FlakyStore {
        private int calls;

        List<String> load(String city) throws TransientStoreException, StoreUnavailableException {
            calls++;
            if ("closed".equals(city)) {
                throw new StoreUnavailableException("hotel in " + city + " is closed", null);
            }
            if (calls < 3) {
                throw new TransientStoreException("timeout on call " + calls);
            }
            return List.of("Danube View", "City Loft");
        }

        int calls() {
            return calls;
        }
    }

    public static void main(String[] args) {
        FlakyStore store = new FlakyStore();

        try {
            List<String> hotels = retry("load hotels", 4, () -> store.load("Budapest"));
            System.out.println("loaded " + hotels.size() + " hotels in " + store.calls() + " calls");
        } catch (RetryFailedException e) {
            // Boundary: one log record with the cause attached to it.
            LOG.log(Level.SEVERE, e.getMessage(), e);
        }

        try {
            retry("load closed hotel", 3, () -> store.load("closed"));
        } catch (RetryFailedException e) {
            System.out.println(e.getMessage() + ", cause: " + e.getCause().getMessage());
            System.out.println("attempts spent: " + e.attempts());
        }
    }
}
```

### Example 6: validation that reports every bad field

A user who typed four wrong values should see four messages, not four attempts. This version collects the failures in a list and throws once, at the end.

Each parse helper takes the error list and returns `null` on failure. That keeps the rest of the checks running: a bad `hotel_id` does not hide a reversed date range. Numbers and dates are parsed inside `try` blocks that catch the parser exception and translate it into a readable message.

The `null` row at the top is handled differently on purpose. `IllegalArgumentException` is unchecked, because a caller that passes `null` has a bug, while a user typing `0` adults has data the import must survive.

```java
// File: ValidationReport.java
// Data shape: validate(Row) throws BookingInvalidException { errors: List<String> }
// Row is raw text, so nothing is parsed until that field has its own check.

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class ValidationReport {

    record Row(String customerEmail, String hotelId, String startDate,
               String endDate, String adults) {
    }

    // Checked: a bad row is an expected outcome of reading a file, and main
    // decides whether to skip the row or stop the whole import.
    static class BookingInvalidException extends Exception {
        private final List<String> errors;

        BookingInvalidException(List<String> errors) {
            super(errors.size() + " problem(s): " + String.join("; ", errors));
            this.errors = List.copyOf(errors); // Copy: the caller keeps a stable list.
        }

        List<String> errors() {
            return errors;
        }
    }

    static void validate(Row row) throws BookingInvalidException {
        if (row == null) {
            // A null row is a caller bug, not user data: unchecked on purpose.
            throw new IllegalArgumentException("row must not be null");
        }

        List<String> errors = new ArrayList<>();

        if (row.customerEmail() == null || row.customerEmail().isBlank()) {
            errors.add("customer_email is empty");
        } else if (!row.customerEmail().contains("@")) {
            errors.add("customer_email has no @: " + row.customerEmail());
        }

        Integer hotelId = parseInt(row.hotelId(), "hotel_id", errors);
        if (hotelId != null && hotelId < 1) {
            errors.add("hotel_id must be positive, got " + hotelId);
        }

        LocalDate start = parseDate(row.startDate(), "start_date", errors);
        LocalDate end = parseDate(row.endDate(), "end_date", errors);
        if (start != null && end != null && end.isBefore(start)) {
            errors.add("end_date " + end + " is before start_date " + start);
        }

        Integer adults = parseInt(row.adults(), "adults", errors);
        if (adults != null && adults < 1) {
            errors.add("adults must be at least 1, got " + adults);
        }

        // One throw at the end, so the user can fix every field in one pass.
        if (!errors.isEmpty()) {
            throw new BookingInvalidException(errors);
        }
    }

    // Records the failure and returns null: one bad field must not hide the rest.
    static Integer parseInt(String text, String field, List<String> errors) {
        if (text == null || text.isBlank()) {
            errors.add(field + " is empty");
            return null;
        }
        try {
            return Integer.valueOf(text.trim());
        } catch (NumberFormatException e) {
            errors.add(field + " is not a whole number: " + text);
            return null;
        }
    }

    static LocalDate parseDate(String text, String field, List<String> errors) {
        if (text == null || text.isBlank()) {
            errors.add(field + " is empty");
            return null;
        }
        try {
            return LocalDate.parse(text.trim());
        } catch (DateTimeParseException e) {
            // Same shape as parseInt: record, return null, carry on.
            errors.add(field + " is not a date (yyyy-MM-dd): " + text);
            return null;
        }
    }

    public static void main(String[] args) {
        List<Row> rows = List.of(
                new Row("anna@example.com", "3", "2026-05-01", "2026-05-04", "2"),
                new Row("", "x", "2026-05-04", "2026-05-01", "0"));

        int valid = 0;

        for (Row row : rows) {
            try {
                validate(row);
                valid++;
                System.out.println("row ok: " + row.customerEmail());
            } catch (BookingInvalidException e) {
                System.out.println("row rejected, " + e.getMessage());
                for (String error : e.errors()) {
                    System.out.println("  - " + error);
                }
            }
        }

        System.out.println(valid + " of " + rows.size() + " rows valid");
    }
}
```

### Example 7: reading a stack trace and its causes

`getStackTrace()` returns only the frames of the throwable you call it on. A wrapped failure therefore prints as several blocks, one per level of the cause chain, and the report below walks that chain.

Frame 0 is where the object was created, which is the `throw` line or the line that called a method that threw. `getLineNumber()` returns a negative value for native frames, and `getFileName()` can be `null`, so a printer has to tolerate both.

The loop over `getSuppressed()` prints failures attached by `close()`. Without it a log shows the primary failure and silently drops the rest.

```java
// File: TraceReport.java
// Data shape: report(Throwable) -> List<String>, one line per cause plus frames
// cause chain: t.getCause() -> ... -> null, each level with its own stack trace

import java.util.ArrayList;
import java.util.List;

public class TraceReport {

    static class StoreException extends Exception {
        StoreException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // No try here: the failure escapes as an unchecked parser exception.
    static int parseStars(String text) {
        return Integer.parseInt(text.trim());
    }

    static int loadStars(String text) throws StoreException {
        try {
            return parseStars(text);
        } catch (NumberFormatException e) {
            // Wrap once, at the layer that knows what the number was for.
            throw new StoreException("cannot load stars from '" + text + "'", e);
        }
    }

    // One block per cause level, plus the top frames and any suppressed failure.
    static List<String> report(Throwable t) {
        List<String> lines = new ArrayList<>();
        Throwable current = t;
        int depth = 0;

        while (current != null) {
            String pad = " ".repeat(depth * 2);

            // getMessage() may be null, so print the class even when the text is empty.
            lines.add(pad + current.getClass().getName()
                    + (current.getMessage() == null ? "" : ": " + current.getMessage()));

            StackTraceElement[] frames = current.getStackTrace();

            if (frames.length > 0) {
                // Frame 0 is where this throwable was created, not where the run began.
                lines.add(pad + "  thrown at " + frames[0]);
            }

            for (StackTraceElement frame : frames) {
                String className = frame.getClassName();
                if (!className.startsWith("java.") && !className.startsWith("jdk.")) {
                    // The first non JDK frame is the line a developer can actually change.
                    if (!frame.equals(frames[0])) {
                        lines.add(pad + "  app frame " + frame);
                    }
                    break;
                }
            }

            for (Throwable suppressed : current.getSuppressed()) {
                lines.add(pad + "  suppressed: " + suppressed);
            }

            current = current.getCause();
            depth++;
        }

        return lines;
    }

    public static void main(String[] args) {
        try {
            System.out.println("stars: " + loadStars("twelve"));
        } catch (StoreException e) {
            for (String line : report(e)) {
                System.out.println(line);
            }

            // The type names the layer, the cause names the line that broke.
            Throwable root = e.getCause() == null ? e : e.getCause();
            System.out.println("root cause type: " + root.getClass().getSimpleName());
        }
    }
}
```

### Example 8: manual suppression when the class is not AutoCloseable

Some legacy types have `close()` without implementing `AutoCloseable`, so try-with-resources cannot take them. The `finally` block then has to do by hand what the compiler does: keep the body failure primary and attach the close failure to it.

The `primary` variable is assigned inside the `catch` and read inside `finally`, which is why it lives outside the `try`. When nothing was in flight, the close failure is thrown instead, because it is the only failure there is.

The three runs in `main` cover both failures at once, a body failure with a clean close, and a clean body with a failing close. Printing `getSuppressed()` is the check that the attachment worked.

```java
// File: ManualSuppression.java
// Data shape: primary RuntimeException, its getSuppressed() array holds close failures

public class ManualSuppression {

    // Legacy style class: it has close(), but it does not implement AutoCloseable,
    // so try-with-resources cannot take it.
    static class Pipe {
        private final String name;
        private final boolean failOnPump;
        private final boolean failOnClose;
        private boolean closed;

        Pipe(String name, boolean failOnPump, boolean failOnClose) {
            this.name = name;
            this.failOnPump = failOnPump;
            this.failOnClose = failOnClose;
        }

        void pump() {
            System.out.println("pumping " + name);
            if (failOnPump) {
                throw new IllegalStateException(name + " pump failed");
            }
        }

        void close() {
            if (closed) {
                return; // Closing twice is not an error for this pipe.
            }
            closed = true;
            System.out.println("closing " + name);
            if (failOnClose) {
                throw new IllegalStateException(name + " close failed");
            }
        }
    }

    // The hand written version of what try-with-resources generates.
    static void drain(Pipe pipe) {
        Throwable primary = null;

        try {
            pipe.pump();
        } catch (RuntimeException e) {
            primary = e; // Remember it: finally runs before the caller sees the failure.
            throw e;
        } finally {
            try {
                pipe.close();
            } catch (RuntimeException closeFailure) {
                if (primary != null) {
                    // Two failures. The body one is what the caller must see,
                    // and the close failure stays attached as context.
                    primary.addSuppressed(closeFailure);
                } else {
                    // Nothing in flight, so the close failure is the real news.
                    throw closeFailure;
                }
            }
        }
    }

    static void report(String label, Throwable t) {
        System.out.println(label + " primary: " + t.getMessage());
        for (Throwable suppressed : t.getSuppressed()) {
            System.out.println(label + " suppressed: " + suppressed.getMessage());
        }
    }

    public static void main(String[] args) {
        try {
            drain(new Pipe("body-and-close", true, true));
        } catch (RuntimeException e) {
            report("both failed:", e);
        }

        try {
            drain(new Pipe("body-only", true, false));
        } catch (RuntimeException e) {
            report("body failed:", e);
        }

        try {
            drain(new Pipe("close-only", false, true));
        } catch (RuntimeException e) {
            report("close failed:", e);
        }
    }
}
```

### Example 9: log once, at the boundary

`findHotel` translates an unchecked storage failure into a checked `StoreException` and keeps the cause. It writes nothing to the log. `main` is the only place that knows whether the caller is a user, a batch job, or a test, so it owns the log line.

`IllegalArgumentException` is caught separately, because a bad `hotel_id` is a caller bug rather than a missing record. The two clauses log at different messages while sharing one level, which is as much separation as this small program needs.

`LOG.log(Level.SEVERE, message, throwable)` prints the message, the class, the frames, and the cause. The shorter `LOG.severe(message)` form drops all of that, so the failure becomes a sentence with no line number.

```java
// File: BoundaryLogging.java
// Data shape: findHotel(hotel_id) -> Hotel, throws checked StoreException
// One log record per failure, written by main, nothing below it logs.

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BoundaryLogging {

    private static final Logger LOG = Logger.getLogger(BoundaryLogging.class.getName());

    record Hotel(int hotelId, String name, int stars) {
    }

    static class StoreException extends Exception {
        StoreException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // The layer that knows the storage detail. It translates, keeps the cause,
    // and stays silent: the boundary decides what the user sees.
    static Hotel findHotel(int hotelId) throws StoreException {
        if (hotelId < 1) {
            // Bad argument from the caller: unchecked, fixed in code, not in a log.
            throw new IllegalArgumentException("hotel_id must be positive, got " + hotelId);
        }
        try {
            return query(hotelId);
        } catch (IllegalStateException e) {
            throw new StoreException("hotel " + hotelId + " is missing", e);
        }
    }

    // Stands in for JDBC. Unchecked on purpose: the row being absent is not
    // something the caller of findHotel can repair by retrying.
    static Hotel query(int hotelId) {
        if (hotelId == 404) {
            throw new IllegalStateException("no row for hotel_id " + hotelId);
        }
        return new Hotel(hotelId, "Hotel " + hotelId, 3);
    }

    public static void main(String[] args) {
        List<Integer> requested = List.of(7, 404, 0);

        for (int hotelId : requested) {
            try {
                Hotel hotel = findHotel(hotelId);
                System.out.println("found " + hotel.name() + " with " + hotel.stars() + " stars");
            } catch (StoreException e) {
                // Expected and explainable: one record, cause attached to it.
                LOG.log(Level.SEVERE, e.getMessage(), e);
            } catch (IllegalArgumentException e) {
                // A caller bug. In a service this becomes a 4xx or a failed assertion.
                LOG.log(Level.SEVERE, "bad request: " + e.getMessage(), e);
            }
        }

        // Five failures would have produced five log lines if each layer logged.
        System.out.println("done");
    }
}
```

## Common mistakes

- Catching `Exception` around a whole method and printing nothing. The failure disappears and the caller keeps running with broken state.
- Writing `catch (IOException e) { }` to satisfy the compiler. If the method truly cannot fail, fix the design or declare `throws`.
- Returning from `finally`. It discards the pending exception and any earlier return value.
- Closing a resource in `finally` without its own try/catch. A close failure replaces the original exception and the real cause is lost.
- Closing resources in the wrong order. Close the `ResultSet`, then the `Statement`, then the `Connection`.
- Catching a superclass before a subclass in the same chain. Java rejects it at compile time, but the fix is often to delete the useless broad handler.
- Rethrowing `new RuntimeException(e.getMessage())` and dropping the cause. Keep the exception object: `new RuntimeException("...", e)`.
- Using exceptions for ordinary control flow, such as a loop that throws to end. An `if` is cheaper and clearer.
- Declaring a custom exception as checked when every caller immediately wraps it. That adds signatures without adding decisions.
- Comparing exception types with `e.getMessage().contains("duplicate")`. Messages change, types and SQL states do not.
- Logging and rethrowing at every layer. One log at the boundary that handles the failure is enough.
- Assuming `getMessage()` is never null. `new IOException()` has no message, so `e.getMessage()` returns null.

## Exam checklist

- Can you name the four parts of a `try` statement and say which combination is legal?
- Can you explain checked versus unchecked with three examples of each, and say who is forced to handle which?
- Can you write a custom checked exception with a message constructor, a cause constructor, and one extra field?
- Can you explain why `catch (Exception e)` before `catch (IOException e)` does not compile?
- Can you show what `finally` does when the try block returns, and why a return inside finally is wrong?
- Can you convert a manual try/finally close into try-with-resources and state the close order?
- Can you explain what happens when both the body and `close()` throw, and how to read `getSuppressed()`?
- Can you translate `SQLException` or `IOException` into a domain exception without losing the cause?
- Can you point at a swallowed exception in a code sample and name the two possible repairs?
- Can you explain why `NumberFormatException` needs no `throws` clause while `SQLException` does?

