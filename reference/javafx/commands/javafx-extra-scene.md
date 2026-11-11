# Scene

JavaFX command · Application

Holds the scene graph that a stage displays. Width and height are the window content size, not the screen size.

## Syntax

```java
new Scene(root, width, height)
```

## Example

```java
// File: Main.java
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.control.Label;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class Main {
    public void show(Stage stage) {
        VBox root = new VBox(10, new Label("Hotels"), new Button("Add"));

        Scene scene = new Scene(root, 640, 480);

        // A stylesheet is resolved on the classpath, keep it under resources
        scene.getStylesheets().add(getClass().getResource("/app.css").toExternalForm());

        // The root can be swapped later with scene.setRoot(other)
        stage.setScene(scene);
        stage.show();
    }
}
```
