# <?import ...?>

JavaFX command · FXML structure

Declares the class behind a short element name. One processing instruction per class, placed above the root element.

## Syntax

```java
<?import javafx.scene.control.Button?>
```

## Example

```java
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Label?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.HBox?>

<HBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1" spacing="8">
    <Label text="City"/>
    <TextField fx:id="cityField"/>
</HBox>
```

## Details

Attribute values that name a class, such as `fx:controller="sample.LoginController"`, use the fully qualified name and need no import. So do enum values written bare, like `fontWeight="BOLD"`, as long as the compiler import for the enum type exists.

Wildcards work (`<?import javafx.scene.control.*?>`), and they hide the mistake you are hunting: a typo inside a wildcard package fails as `ClassNotFoundException` at load time with no useful line number. Write the explicit imports in exam answers.
