# Label

JavaFX command · Controls

Shows read only text. setWrapText and setMaxWidth keep long names inside the layout.

## Syntax

```java
new Label("text")
```

## Example

```java
// File: Main.java
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        Label title = new Label("Danube View");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Label description = new Label(
            "A long description that would overflow the window without wrapping.");
        description.setWrapText(true);
        description.setMaxWidth(280);

        // A label bound to a property updates itself
        Label stars = new Label();
        stars.textProperty().bind(title.textProperty().concat(" · 4 stars"));

        return new VBox(6, title, description, stars);
    }
}
```
