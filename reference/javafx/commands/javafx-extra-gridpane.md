# GridPane

JavaFX command · Layout

Arranges nodes in rows and columns with explicit cell coordinates. Column constraints control the widths.

## Syntax

```java
grid.add(node, column, row)
```

## Example

```java
// File: Main.java
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;

public class Main {
    public GridPane build() {
        GridPane grid = new GridPane();
        grid.setHgap(8);
        grid.setVgap(6);
        grid.setPadding(new javafx.geometry.Insets(12));

        grid.add(new Label("Name"), 0, 0);
        grid.add(new TextField(), 1, 0);

        grid.add(new Label("City"), 0, 1);
        grid.add(new TextField(), 1, 1);

        // Span two columns: add(node, column, row, colspan, rowspan)
        grid.add(new Label("Both fields are required"), 0, 2, 2, 1);

        // The second column absorbs the extra width
        ColumnConstraints labels = new ColumnConstraints();
        ColumnConstraints fields = new ColumnConstraints();
        fields.setHgrow(Priority.ALWAYS);
        grid.getColumnConstraints().addAll(labels, fields);

        return grid;
    }
}
```
