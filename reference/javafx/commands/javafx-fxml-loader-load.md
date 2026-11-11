# FXMLLoader.load(URL)

JavaFX command · Loading

Static helper that builds the tree and returns the root. It gives no access to the controller.

## Syntax

```java
Parent root = FXMLLoader.load(url);
```

## Example

```java
import java.io.IOException;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;

public Parent buildHello() throws IOException {
    // One line, no controller handle. Fine for a screen with nothing to pass in.
    return FXMLLoader.load(getClass().getResource("/fxml/hello.fxml"));
}
```

## Details

The static call creates its own loader internally, so `getController()` is out of reach. When the screen needs data, a reference for navigation, or a resource bundle, use a `new FXMLLoader(...)` instead.

`load()` throws `IOException` for a missing file, bad XML, or a broken controller. It does not throw for a null URL: that fails with a message about the location not being set.
