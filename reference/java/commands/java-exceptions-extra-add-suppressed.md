# Throwable.addSuppressed()

Java command · Exceptions

Attaches a second failure to the one already in flight, so both stay readable and the primary keeps its stack trace.

## Syntax

```java
primary.addSuppressed(failure)
```

## Example

```java
// File: BatchFailures.java
// Data shape: BatchException { message, suppressed: Throwable[] } for a batch run
import java.util.List;

public class BatchFailures {

    static class BatchException extends RuntimeException {
        BatchException(String message) {
            super(message);
        }
    }

    static void process(String row) {
        if (row.startsWith("!")) {
            throw new IllegalArgumentException("cannot process " + row);
        }
        System.out.println("processed " + row);
    }

    // Runs every row, keeps the first failure primary, attaches the rest as suppressed.
    static void runAll(List<String> rows) {
        BatchException batch = null;

        for (String row : rows) {
            try {
                process(row);
            } catch (RuntimeException e) {
                if (batch == null) {
                    batch = new BatchException(rows.size() + " row batch failed");
                }
                batch.addSuppressed(e); // A list field would work too, but this stays throwable.
            }
        }

        if (batch != null) {
            throw batch;
        }
    }

    public static void main(String[] args) {
        try {
            runAll(List.of("row-1", "!row-2", "row-3", "!row-4"));
        } catch (BatchException e) {
            System.out.println(e.getMessage());
            for (Throwable failure : e.getSuppressed()) {
                System.out.println("  failed: " + failure.getMessage());
            }
        }
    }
}
```

## Details

`addSuppressed` is not only for `close()`. A batch job that must attempt every row can collect failures on one throwable instead of stopping at the first, and the report then shows one failure with its details attached.

A `List<String>` field is the other option, and it is better when the caller has to print a report in its own format. `getSuppressed()` is cheaper to write and keeps the original exception objects, so their messages, causes, and stack traces are still intact.
