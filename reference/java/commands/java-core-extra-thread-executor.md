# Executors.newFixedThreadPool()

Java command · Threads

Runs submitted tasks on a fixed number of reused threads. shutdown and awaitTermination end the pool and wait for the running work.

## Syntax

```java
Executors.newFixedThreadPool(n)
```

## Example

```java
// File: Pool.java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class Pool {
    public static void main(String[] args) throws InterruptedException {
        // Two worker threads, reused for every submitted task
        ExecutorService pool = Executors.newFixedThreadPool(2);
        for (int i = 1; i <= 4; i++) {
            int id = i; // a lambda captures only effectively final values
            pool.submit(() -> System.out.println("task " + id));
        }

        // shutdown refuses new tasks, awaitTermination waits for the running ones
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("done"); // always last
    }
}
```
