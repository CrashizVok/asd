# stylesheets and styleClass

JavaFX command · Styling

Attaches a stylesheet relative to the FXML file and adds CSS class names to a node.

## Syntax

```java
stylesheets="@app.css" styleClass="panel"
```

## Example

```java
<?import javafx.scene.layout.VBox?>
<?import javafx.scene.control.Label?>

<!-- @app.css is resolved next to this file; styleClass takes a space separated list -->
<VBox xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1"
      stylesheets="@app.css" styleClass="panel">

    <Label text="Signed in" styleClass="hint"/>
    <Label text="Wrong password" styleClass="hint error"/>
</VBox>
```

## Details

From code, attach the sheet to the scene once so it survives `scene.setRoot(...)`:

```java
scene.getStylesheets().add(getClass().getResource("/css/app.css").toExternalForm());
```

`toExternalForm()` is not optional: `getStylesheets()` holds strings, and a `URL` does not compile there.

Inline `style="-fx-text-fill: red;"` wins over any sheet rule. Keep it for one off debugging, because it cannot be themed and it hides the rule from the CSS file.
