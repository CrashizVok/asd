# initialize()

JavaFX command · Lifecycle

Runs once per load, after field injection and before load() returns. Wiring belongs here, layout does not.

## Syntax

```java
@FXML private void initialize() { }
```

## Example

```java
package sample;

import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.ComboBox;

public class FilterController {

    @FXML private ComboBox<String> cityBox;

    @FXML
    private void initialize() {
        // fields are injected by now, so it is safe to read them
        cityBox.setItems(FXCollections.observableArrayList("Budapest", "Vienna", "Prague"));
        cityBox.getSelectionModel().selectFirst();
    }
}
```

## Details

The method may be private. It runs again for every new load, so each new controller starts from a clean state.

The nodes exist but the scene does not: `getScene()` returns null and control sizes are usually zero. Code that needs real measurements goes into `Platform.runLater(...)` or a listener on the scene.

The `Initializable` interface offers `initialize(URL location, ResourceBundle resources)` and still works. Implementing it and also writing an annotated `initialize()` calls both, in an order not worth relying on. Pick one.
