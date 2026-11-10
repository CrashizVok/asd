# Threads

Java topic · Exam Wiki

```java
Thread worker = new Thread(() -> {
    for (int i = 0; i < 3; i++) {
        System.out.println("worker " + i);
    }
});
worker.start();
worker.join(); // wait for it
```

`start()` runs the task on a new thread. `join()` waits for it to finish. Do not call `run()` directly; that runs on the current thread. Shared mutable state needs synchronization.
