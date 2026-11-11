# Log once at the boundary

Java command · Diagnostics

One log record per failure, with the throwable attached. Inner layers wrap and stay silent, so the log shows one incident instead of five.

## Syntax

```java
LOG.log(Level.SEVERE, message, error)
```

## Example

```java
// File: LogOnce.java
// Data shape: one log record per failure, carrying message and throwable
import java.util.logging.Level;
import java.util.logging.Logger;

public class LogOnce {

    private static final Logger LOG = Logger.getLogger(LogOnce.class.getName());

    static class RepoException extends Exception {
        RepoException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static String load(String key) throws RepoException {
        try {
            if (key.isEmpty()) {
                throw new IllegalArgumentException("empty key");
            }
            return "value for " + key;
        } catch (IllegalArgumentException e) {
            // Wrap with the cause and stay silent: the boundary owns the log line.
            throw new RepoException("cannot load '" + key + "'", e);
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println(load(""));
        } catch (RepoException e) {
            // The throwable argument prints the whole stack, so no second log is needed.
            LOG.log(Level.SEVERE, e.getMessage(), e);
            System.out.println("load failed, see log");
        }
    }
}
```

## Details

Passing the throwable as the third argument is what prints the stack. `LOG.severe(e.getMessage())` loses the frames, the cause, and even the type when the message is null.

Decide which layer owns the record. A repository that logs and rethrows, then a service that logs and rethrows, then a controller that logs, writes the same stack three times and makes one failure look like three.

Levels are part of the decision: `WARNING` for a failure that was retried or replaced, `SEVERE` for one the user will notice. In tests, `java.util.logging` can be pointed at a handler that keeps records in memory, which beats reading console output.
