# <fx:include>

JavaFX command · Composition

Splices another FXML file into the tree. With fx:id, the parent controller gets both the child root and the child controller.

## Syntax

```java
<fx:include fx:id="name" source="child.fxml"/>
```

## Example

```java
<?import javafx.scene.layout.BorderPane?>

<BorderPane xmlns="http://javafx.com/javafx/17"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="sample.MainController">

    <!-- Loaded while the parent is built, with its own controller and initialize() -->
    <bottom>
        <fx:include fx:id="statusBar" source="status-bar.fxml"/>
    </bottom>
</BorderPane>
```

## Details

```java
public class MainController {

    // fx:id="statusBar" produces exactly these two field names
    @FXML private HBox statusBar;
    @FXML private StatusBarController statusBarController;

    @FXML private void initialize() {
        statusBarController.show("Ready");   // child initialize already ran
    }
}
```

The `source` path is relative to the including file, so keep both files in the same folder. Nested controllers initialize before the parent's `initialize()`, which is why the parent can push data into the child there.

Use includes for repeated chrome: toolbars, status bars, form sections. A screen that gets switched to should be loaded by code, because an include cannot be replaced without replacing its parent.
