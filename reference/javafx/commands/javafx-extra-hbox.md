# HBox

JavaFX command · Layout

Places children side by side. Hgrow decides which child absorbs the extra width.

## Syntax

```java
new HBox(spacing, children...)
```

## Example

```java
// File: Main.java
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;

public class Main {
    public HBox build() {
        TextField search = new TextField();
        search.setPromptText("Search hotels");

        Button find = new Button("Find");

        HBox row = new HBox(8, search, find);
        row.setPadding(new javafx.geometry.Insets(8));

        // The text field takes the width, the button keeps its size
        HBox.setHgrow(search, Priority.ALWAYS);

        return row;
    }
}
```
