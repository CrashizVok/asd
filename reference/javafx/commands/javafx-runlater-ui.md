# Platform.runLater()

JavaFX command · Threads

Queues a task on the FX thread. Any UI change from a background thread must go through it, otherwise JavaFX throws IllegalStateException.

## Syntax

```java
Platform.runLater(() -> updateUi())
```

## Example

```java
new Thread(() -> {
    List<Booking> rows = readBookings(path);   // slow work, no UI calls
    Platform.runLater(() -> {
        list.getItems().setAll(rows);          // back on the FX thread
        status.setText(rows.size() + " rows loaded");
    });
}).start();
```

## Details

The exception text is `Not on FX application thread; currentThread = ...`. It appears the moment a control is touched, which is why the failing line is usually a setter, not the thread creation.

`Task` and `Service` wrap the same pattern with `setOnSucceeded` and progress properties. For one file load, the plain thread plus `Platform.runLater` is shorter and easier to defend in an exam.
