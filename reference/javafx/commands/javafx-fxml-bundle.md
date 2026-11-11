# Resource bundle keys

JavaFX command · Styling

Reads a string from the loader's resource bundle instead of hard coding it in the FXML.

## Syntax

```java
text="%save.label"
```

## Example

```java
<?import javafx.scene.control.Button?>
<?import javafx.scene.layout.HBox?>

<HBox xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.FormController">
    <Button text="%save.label" onAction="#save"/>
</HBox>
```

## Details

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/form.fxml"));
loader.setResources(ResourceBundle.getBundle("messages"));
Parent root = loader.load();
```

A `%key` with no bundle is shown literally on the button, so the mistake is visible rather than fatal. That also means a missing key slips through review, and the exam answer should mention the bundle file by name.
