# Task

JavaFX command · Concurrency

Runs background work with success, failure, and progress callbacks that already run on the FX thread.

## Syntax

```java
new Task<Result>() { protected Result call() { ... } }
```

## Example

```java
// File: Main.java
import javafx.concurrent.Task;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import java.util.List;

public class Main {
    public void load(TableView<String> table, Label status) {
        Task<List<String>> task = new Task<>() {
            @Override
            protected List<String> call() throws Exception {
                // Runs on a background thread, may throw
                return List.of("Danube View", "City Loft");
            }
        };

        // Handlers run on the FX thread, so UI access is safe here
        task.setOnSucceeded(event -> {
            table.getItems().setAll(task.getValue());
            status.setText("Loaded " + task.getValue().size());
        });

        task.setOnFailed(event -> status.setText("Failed: " + task.getException().getMessage()));

        Thread thread = new Thread(task);
        thread.setDaemon(true);
        thread.start();
    }
}
```

## Details

## Task against Platform.runLater

`Platform.runLater` moves one update to the FX thread. `Task` also returns a result and reports failure, so the success path and the error path stay separate.

## Rules

- Only `call` runs on the background thread. Do not touch controls there.
- `setOnSucceeded`, `setOnFailed`, and `updateMessage` run on the FX thread.
- Call `setOnCancelled` when a cancel button exists, otherwise the worker keeps running.
- One `Task` runs once. For repeated work use `Service` and call `restart`.
