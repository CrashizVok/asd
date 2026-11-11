# opens to javafx.fxml

JavaFX command · Project

Required when the project has a module-info.java. The loader accesses the controller by reflection, so the package must be open to the FXML module.

## Syntax

```java
opens app to javafx.fxml;
```

## Example

```java
module app {
    requires javafx.controls;
    requires javafx.fxml;

    // Reflection needs this, even when the class is public.
    opens app to javafx.fxml;
    exports app;
}
```

## Details

A missing opens line fails at startup with an IllegalAccessException or a LoadException that mentions the controller class. Non-modular projects, which is most exam projects, never need this line.

Add requires javafx.fxml as well. The controls artifact does not bring the FXML loader with it.
