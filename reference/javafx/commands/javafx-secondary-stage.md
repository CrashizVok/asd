# Second window

JavaFX command · Stage

Creates another window with its own scene. The owner keeps it above the main window, and the modality decides which windows are blocked while it is open.

## Syntax

```java
new Stage(); dialog.initOwner(owner); dialog.initModality(Modality.WINDOW_MODAL);
```

## Example

```java
Stage dialog = new Stage();
dialog.initOwner(primaryStage);
dialog.initModality(Modality.WINDOW_MODAL);
dialog.setTitle("Details");
dialog.setScene(new Scene(new Label("Row details"), 360, 240));
dialog.show();   // use showAndWait() to block until it closes
```

## Details

`WINDOW_MODAL` blocks the owner only. `APPLICATION_MODAL` blocks every window of the application. `Modality.NONE` is the default and behaves like an independent window.

For a message or a single question, use `Alert` instead. A hand-built dialog needs its own buttons and its own close handling, which is three times the code for the same result.
