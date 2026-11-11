# <fx:root type="...">

JavaFX command · Composition

Builds into an existing instance instead of a new one, so a node subclass can be its own controller.

## Syntax

```java
<fx:root type="javafx.scene.layout.HBox" xmlns="..." xmlns:fx="...">
```

## Example

```java
package sample;

import java.io.IOException;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

public class Row extends HBox {

    @FXML private Label nameLabel;

    public Row(String name) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/row.fxml"));
        loader.setRoot(this);        // build into this object
        loader.setController(this);  // and use it as the controller
        try {
            loader.load();
        } catch (IOException e) {
            throw new IllegalStateException("row.fxml is broken", e);
        }
        nameLabel.setText(name);
    }
}
```

## Details

The FXML root element is `<fx:root type="javafx.scene.layout.HBox">` and the file has no `fx:controller` attribute. The instance passing `setController(this)` is the controller, which is how a typed constructor survives.

Setting both `fx:controller` and `setController` fails with a controller already specified error. With `fx:root` the attribute is always the wrong choice.

This pattern is useful for list rows, table cells and small reusable widgets; it is overkill for a screen.
