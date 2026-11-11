# styleClass

JavaFX command · CSS

Adds a CSS class to a node. JavaFX CSS needs the -fx- prefix on every property and matches classes with a leading dot.

## Syntax

```java
node.getStyleClass().add("form")
```

## Example

```java
// FXML
<VBox styleClass="form" spacing="10">
    <Label text="Booking details" styleClass="form-title"/>
</VBox>

/* app.css */
.form {
    -fx-background-color: #ffffff;
    -fx-background-radius: 10;
    -fx-padding: 12;
}

.form-title {
    -fx-font-size: 15px;
    -fx-font-weight: bold;
}
```

## Details

background-color without -fx- is ignored without a warning. The same happens to a selector that matches nothing, so a typo in the style class looks like a broken CSS file.

A node can carry several classes: styleClass="button primary" in FXML, or two add calls in code. A class selector beats a type selector, which is why .button.primary overrides .button.
