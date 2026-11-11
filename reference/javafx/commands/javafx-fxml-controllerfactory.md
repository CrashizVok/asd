# loader.setControllerFactory()

JavaFX command · Loading

Supplies controller instances from code, which allows constructor arguments when initialize() needs the data.

## Syntax

```java
loader.setControllerFactory(type -> new MyController(dep));
```

## Example

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));

// The callback receives the class named in fx:controller and must return
// an instance of it. The order exists before the controller is built.
loader.setControllerFactory(type -> new OrderController(order, repository));

Parent root = loader.load();
```

## Details

Returning a subclass of the requested type is fine. Returning an unrelated object throws `ClassCastException` during the load.

The factory is the right tool when `initialize()` needs the data to build a table model or fill a list. The setter approach from `getController()` runs too late for that.

Do not combine it with `setController(...)` on the same loader, and do not expect the factory to override an `fx:controller` class with a different type.
