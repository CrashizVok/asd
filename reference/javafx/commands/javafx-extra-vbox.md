# VBox

JavaFX command · Layout

Stacks children vertically. The spacing constructor argument is the gap in pixels between them.

## Syntax

```java
new VBox(spacing, children...)
```

## Example

```java
// File: Main.java
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        Label title = new Label("Hotels");
        Button add = new Button("Add");

        // 10 pixels between children, aligned to the left
        VBox box = new VBox(10, title, add);
        box.setAlignment(Pos.TOP_LEFT);
        box.setPadding(new javafx.geometry.Insets(12));

        // Grow makes the add button take the free vertical space
        VBox.setVgrow(add, Priority.ALWAYS);

        return box;
    }
}
```
