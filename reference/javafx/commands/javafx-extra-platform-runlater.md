# Platform.runLater

JavaFX command · Concurrency

Schedules a task on the JavaFX application thread. UI changes from a worker thread must go through it.

## Syntax

```java
Platform.runLater(() -> { ... })
```

## Example

```java
// File: Main.java
import javafx.application.Platform;
import javafx.scene.control.Label;

public class Main {
    public void loadCount(Label label) {
        Thread worker = new Thread(() -> {
            // This code runs off the FX thread, so no UI access here
            int count = countHotelsInDatabase();

            // The UI update is queued and runs on the FX thread
            Platform.runLater(() -> label.setText(count + " hotels"));
        });

        worker.setDaemon(true); // does not keep the JVM alive
        worker.start();
    }

    private int countHotelsInDatabase() {
        return 12;
    }
}
```
