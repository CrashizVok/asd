# Application.start

JavaFX command · Application

The entry point of a JavaFX program. launch builds the FX thread and calls start with the primary stage.

## Syntax

```java
public class App extends Application { public void start(Stage stage) }
```

## Example

```java
// File: HotelApp.java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class HotelApp extends Application {

    @Override
    public void start(Stage stage) {
        StackPane root = new StackPane(new Label("Hotels"));
        Scene scene = new Scene(root, 400, 300);
        stage.setScene(scene);
        stage.setTitle("Hotel manager");
        stage.show(); // without show the window never appears
    }

    public static void main(String[] args) {
        launch(args); // calls start on the JavaFX application thread
    }
}
```
