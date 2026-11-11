# fx:id

JavaFX command · Injection

Registers a node in the loader namespace, sets the node id, and matches a controller field by name.

## Syntax

```java
fx:id="fieldName"
```

## Example

```java
<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<!-- The label is injected into the controller field named totalLabel. -->
<VBox xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1">
    <Label fx:id="totalLabel" text="0.00"/>
</VBox>
```

## Details

The value must be a valid Java identifier. `fx:id="total label"` or `fx:id="total.label"` is a parse error.

`fx:id` also sets the node's `id` property, so CSS can select `#totalLabel`. That id selector is fine for a one off; a style class is better when several nodes share a look.

A typo does not throw. The field simply stays null and the failure appears where you use it, which is why the name is the first thing to check when a controller field is unexpectedly null.
