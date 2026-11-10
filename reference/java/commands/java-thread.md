# Thread and Runnable

Java command · Threads

Runs code on another thread. start() creates the thread; run() would run it on the current thread.

## Syntax

```java
new Thread(() -> { ... }).start();
```

## Example

```java
Thread worker = new Thread(() -> {
    System.out.println("working");
});
worker.start();
worker.join();
```
