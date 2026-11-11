# BorderPane

JavaFX command · Layout

Splits the window into top, left, right, bottom, and center. The center region grows, the others keep their size.

## Syntax

```java
new BorderPane(); pane.setCenter(node)
```

## Example

```java
// File: Main.java
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;

public class Main {
    public BorderPane build() {
        BorderPane pane = new BorderPane();

        // Header row with a title and one action
        HBox top = new HBox(8, new Label("Hotels"), new Button("Add"));
        top.setPadding(new javafx.geometry.Insets(8));

        pane.setTop(top);
        pane.setCenter(new TableView<>());       // takes all remaining space
        pane.setBottom(new Label("12 hotels"));  // status line

        // setLeft and setRight are for navigation and side panels
        return pane;
    }
}
```
