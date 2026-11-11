# fx:controller

JavaFX command · FXML

Names the controller class for an FXML file. The value is a fully qualified class name and the class needs a no-argument constructor.

## Syntax

```java
<BorderPane fx:controller="app.BookingController">
```

## Example

```java
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.layout.BorderPane?>

<BorderPane xmlns="http://javafx.com/javafx/21"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="app.BookingController">
</BorderPane>
```

## Details

A missing package in fx:controller produces a ClassNotFoundException inside a LoadException. The message repeats the exact string from the XML, so compare the two before changing the Java class.

Put fx:controller on the root element of the file. A nested element can name a different controller, which is rare and hard to debug, so use one controller per FXML file.
