# setDefaultUncaughtExceptionHandler

Java command · Diagnostics

Handles failures that no try block caught, on any thread. The last place to log before that thread dies.

## Syntax

```java
Thread.setDefaultUncaughtExceptionHandler(handler)
```

## Example

```java
// File: UncaughtHandler.java
// Data shape: handler receives (thread: Thread, error: Throwable) for every uncaught failure
public class UncaughtHandler {

    public static void main(String[] args) throws InterruptedException {
        Thread.setDefaultUncaughtExceptionHandler((thread, error) -> {
            // Runs on the dying thread, so keep it short and never throw here.
            System.out.println("uncaught in " + thread.getName() + ": " + error);

            for (Throwable cause = error.getCause(); cause != null; cause = cause.getCause()) {
                System.out.println("  caused by " + cause);
            }
        });

        Thread worker = new Thread(() -> {
            throw new IllegalStateException("worker died",
                    new java.io.IOException("socket closed"));
        }, "import-worker");

        worker.start();
        worker.join(); // Wait, otherwise main may exit before the handler prints.

        System.out.println("main still alive");
    }
}
```

## Details

The handler runs on the thread that is dying, so keep it short and do not throw from it. It receives the thread and the throwable, which is enough to log the thread name and the full chain.

One handler per thread wins over the default: `thread.setUncaughtExceptionHandler(...)`. The default covers every thread that did not set its own, including the ones a thread pool creates, unless the pool installs its own.

This is a safety net, not a recovery path. A thread that reaches an uncaught handler is gone, and any work it held unfinished stays unfinished.
