# fx:controller

JavaFX command · Injection

Names the class that receives the injected nodes and handles the events. The loader instantiates it with a no argument constructor.

## Syntax

```java
fx:controller="pkg.Controller"
```

## Example

```java
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.LoginController">
    <!-- sample.LoginController must be public and have a public no arg constructor -->
</VBox>
```

## Details

The class needs a constructor the loader can call without arguments. A controller that only has `LoginController(Repository repo)` cannot be named here: use `setControllerFactory` on the loader instead.

In a modular project the controller package must be opened to `javafx.fxml` (`opens sample to javafx.fxml;`). Without it the class is loaded but reflection is refused, and the error reads like a missing class.
