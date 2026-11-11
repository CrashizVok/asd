# Alert

JavaFX command · Dialogs

A modal dialog for messages and confirmations. showAndWait blocks until the user picks a button.

## Syntax

```java
new Alert(Alert.AlertType.CONFIRMATION, text, buttons)
```

## Example

```java
// File: Main.java
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;

public class Main {
    public void deleteHotel(String name) {
        Alert confirm = new Alert(
            Alert.AlertType.CONFIRMATION,
            "Delete " + name + "?",
            ButtonType.OK,
            ButtonType.CANCEL
        );
        confirm.setTitle("Confirm delete");
        confirm.setHeaderText(null); // removes the bold default line

        // showAndWait returns the chosen button, or empty if closed
        confirm.showAndWait().ifPresent(type -> {
            if (type == ButtonType.OK) {
                System.out.println("deleted " + name);
            }
        });

        // The other types: INFORMATION, WARNING, ERROR, NONE
        Alert error = new Alert(Alert.AlertType.ERROR, "Could not save");
        error.show();
    }
}
```
