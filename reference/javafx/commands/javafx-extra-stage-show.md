# Stage title and close

JavaFX command · Application

The stage is the top level window. Set the title, a minimum size, and a close handler before showing it.

## Syntax

```java
stage.setTitle("text"); stage.show();
```

## Example

```java
// File: Main.java
import javafx.stage.Stage;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;

public class Main {
    public void show(Stage stage) {
        stage.setTitle("Hotel manager");
        stage.setMinWidth(480);
        stage.setMinHeight(320);

        // Ask before closing when there are unsaved changes
        stage.setOnCloseRequest(event -> {
            Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
                "Close without saving?", ButtonType.OK, ButtonType.CANCEL);
            confirm.setHeaderText(null);

            if (confirm.showAndWait().orElse(ButtonType.CANCEL) != ButtonType.OK) {
                event.consume(); // cancels the close
            }
        });

        stage.show();
    }
}
```
