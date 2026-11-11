# Button setOnAction

JavaFX command · Controls

Attaches a handler to a button click. The handler runs on the JavaFX application thread, so keep it short.

## Syntax

```java
button.setOnAction(event -> { ... })
```

## Example

```java
// File: Main.java
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        Label counter = new Label("0");
        Button add = new Button("Add hotel");

        add.setOnAction(event -> {
            // Parsing here is safe because the label holds a number
            int next = Integer.parseInt(counter.getText()) + 1;
            counter.setText(String.valueOf(next));
        });

        // setDisable greys the button out and blocks the handler
        add.disableProperty().bind(counter.textProperty().isEqualTo("5"));

        return new VBox(8, add, counter);
    }
}
```
