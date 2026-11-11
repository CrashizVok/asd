# Root element and namespaces

JavaFX command · FXML structure

Every FXML file has one root element. It carries the default JavaFX namespace and the fx namespace, and usually names the controller.

## Syntax

```java
<RootType xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1" fx:controller="pkg.Controller">
```

## Example

```java
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.layout.BorderPane?>

<!-- One root. Both namespaces go here and are inherited by children. -->
<BorderPane xmlns="http://javafx.com/javafx/17"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="sample.MainController">
    <!-- children are added to the parent in document order -->
</BorderPane>
```

## Details

The default namespace value is the JavaFX version the file was written for. The runtime does not enforce it strictly, but keep it near your JDK level (`8`, `11`, `17`, `21`).

Without `xmlns:fx="http://javafx.com/fxml/1"` the parser rejects every `fx:` attribute before the loader runs, so a file that looks fine in an editor fails on startup.

A root must be a class with a no argument constructor. Interfaces, abstract classes and `Node` itself cannot be roots.
