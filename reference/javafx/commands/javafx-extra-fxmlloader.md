# FXMLLoader

JavaFX command · FXML

Builds the scene graph from an FXML file. load returns the root node and getController returns the controller instance.

## Syntax

```java
new FXMLLoader(getClass().getResource("/view.fxml"))
```

## Example

```java
// File: Main.java
import java.io.IOException;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main {
    public void show(Stage stage) throws IOException {
        // The leading slash starts at the classpath root
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/hotel-view.fxml"));

        Parent root = loader.load(); // parses the file and injects @FXML fields
        HotelController controller = loader.getController();
        controller.loadHotels();

        stage.setScene(new Scene(root, 800, 600));
        stage.show();
    }
}
```
