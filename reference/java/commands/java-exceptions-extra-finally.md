# finally

Java command · Exceptions

Runs on every exit path: normal end, caught exception, uncaught exception, return, break, continue. A return inside it discards the pending result.

## Syntax

```java
try { ... } finally { ... }
```

## Example

```java
// File: FinallyCleanup.java
// Data shape: try { return a; } catch { return b; } finally { cleanup }
public class FinallyCleanup {

    private static final StringBuilder LOG = new StringBuilder();

    static int parseOrZero(String text) {
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            return 0;
        } finally {
            // Runs before either return reaches the caller, on both paths.
            LOG.append("parsed '").append(text).append("'; ");
        }
    }

    public static void main(String[] args) {
        System.out.println(parseOrZero("12"));
        System.out.println(parseOrZero("x"));
        System.out.println(LOG);

        // Do not return from finally: it discards the exception and the earlier value.
    }
}
```

## Details

The block is for cleanup that must happen even when the method leaves early. A `return` in the try block computes its value, then finally runs, then the caller receives the value, so an assignment or a log line in finally still happens first.

Two traps. A `return` inside finally throws away the pending exception and any earlier return value, which is how a real bug becomes a silent wrong answer. `System.exit(0)` skips finally blocks entirely, because the JVM shuts down instead of unwinding the stack.

For anything that implements `AutoCloseable`, use try-with-resources. Keep finally for counters, timers, and legacy close methods, and do not let a second failure in finally replace the one already in flight.
