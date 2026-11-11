# Alert

JavaFX command · Dialogs

Shows a standard dialog with one OK button. showAndWait blocks until it is closed, which is what a message or an error needs.

## Syntax

```java
new Alert(Alert.AlertType.INFORMATION); alert.showAndWait();
```

## Example

```java
Alert alert = new Alert(Alert.AlertType.ERROR);
alert.setTitle("Error");
alert.setHeaderText("Could not read the file");
alert.setContentText(String.valueOf(error.getMessage()));
alert.showAndWait();
```

## Details

`show()` returns immediately and the code continues, so a user can stack five error dialogs before reading one. `showAndWait()` waits.

For a yes or no question, change the buttons and read the result:

```java
Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
confirm.setHeaderText("Discard changes?");
confirm.getButtonTypes().setAll(ButtonType.YES, ButtonType.NO);
confirm.showAndWait()
        .filter(button -> button == ButtonType.YES)
        .ifPresent(button -> closeWithoutSaving());
```

The four types are `INFORMATION`, `WARNING`, `ERROR` and `CONFIRMATION`. The type changes the icon and the default buttons, not the behaviour.
