# <?import ...?>

JavaFX command · FXML

Declares a JavaFX class so the XML parser accepts it as a tag. Every class used in the file needs an import.

## Syntax

```java
<?import javafx.scene.control.TableView?>
```

## Example

```java
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.TableColumn?>
<?import javafx.scene.control.TableView?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/21"
      xmlns:fx="http://javafx.com/fxml/1">
    <TableView>
        <columns>
            <TableColumn text="Guest"/>
        </columns>
    </TableView>
</VBox>
```

## Details

A wildcard import such as javafx.scene.control.* also works and saves typing:

```xml
<?import javafx.scene.control.*?>
```

Explicit imports make the file longer and easier to read in an exam, because the top of the file lists what the window contains. Layout containers from javafx.scene.layout and controls from javafx.scene.control are the two groups you almost always need.
