# new FXMLLoader(...).load()

JavaFX command · Loading

The instance form. Use it when you need the controller, a controller factory, or a resource bundle.

## Syntax

```java
FXMLLoader loader = new FXMLLoader(url); Parent root = loader.load();
```

## Example

```java
import java.io.IOException;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;

FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));
Parent root;
try {
    root = loader.load();
} catch (IOException e) {
    throw new IllegalStateException("order.fxml is broken", e);
}
OrderController controller = loader.getController();   // non null after a successful load
```

## Details

A loader is single use in practice. A second `load()` on the same instance rebuilds the tree and creates a second controller, so per screen means per loader.

`load()` returns the root, typed by the FXML root element. Assign it to `Parent` for a scene, or to the concrete type when you need its methods before adding it to the scene.
