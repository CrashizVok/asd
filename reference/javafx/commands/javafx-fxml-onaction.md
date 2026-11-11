# onAction="#handler"

JavaFX command · Events

Connects a control event to a controller method. The handler may take no arguments or one event argument.

## Syntax

```java
onAction="#methodName"
```

## Example

```java
<?import javafx.scene.control.Button?>
<?import javafx.scene.layout.HBox?>

<!-- The # prefix means: look this name up in the controller -->
<HBox xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.ToolbarController">
    <Button text="Save" onAction="#save"/>
    <Button text="Cancel" onAction="#cancel"/>
</HBox>
```

## Details

```java
package sample;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;

public class ToolbarController {

    @FXML private void save() { /* no argument form */ }

    @FXML private void cancel(ActionEvent event) { /* event form */ }
}
```

Both signatures are valid. The method must be public or annotated `@FXML`; a private method without the annotation is invisible to reflection and the load fails with a message naming the `onAction` value.

Return values are ignored. Declare the method `void` so nobody expects one.

The same pattern applies to other events with their own attributes: `onMouseClicked`, `onKeyPressed`, `onShowing`. Anything more involved than a method name is easier to attach in `initialize()` with a lambda.
