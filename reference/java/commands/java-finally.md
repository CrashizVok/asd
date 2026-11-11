# finally

Java command · Exceptions

Runs cleanup on every exit path: normal end, handled exception, unhandled exception, return, break, or continue.

## Syntax

```java
try { ... } catch (Type e) { ... } finally { ... }
```

## Example

```java
import java.util.Scanner;

class FinallyDemo {
    static void readEmail() {
        Scanner scanner = new Scanner(System.in);
        try {
            System.out.print("customer_email: ");
            String email = scanner.nextLine();
            System.out.println("checking " + email);
            if (email.isBlank()) {
                return; // finally still runs before the return completes
            }
            System.out.println("accepted");
        } finally {
            scanner.close();
            System.out.println("scanner closed");
        }
    }

    // Trap: a return in finally discards the pending exception and earlier return.
    static int broken() {
        try {
            return 1;
        } finally {
            return 2; // Always 2, and any exception from try vanishes.
        }
    }
}
```

## Details

Use finally for cleanup that has no AutoCloseable form, or for a counter or log line that must always run. When the resource implements AutoCloseable, try-with-resources is the better tool because it keeps the original exception and attaches close failures as suppressed.

System.exit skips finally blocks. A JVM crash or a killed process skips them too.
