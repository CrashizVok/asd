# FXMLLoader.load()

JavaFX command · FXML

Builds the node tree described by an FXML file, creates its controller, injects the fx:id fields and calls initialize(). Returns the root node.

## Syntax

```java
new FXMLLoader(url).load()
```

## Example

```java
URL fxml = App.class.getResource("/app/bookings.fxml");
if (fxml == null) {
    throw new IllegalStateException("bookings.fxml is not on the classpath");
}

// One call does four things: parse, create the controller, inject fields, call initialize().
Parent root = new FXMLLoader(fxml).load();
stage.setScene(new Scene(root, 1040, 640));
```

## Details

The loader reads the XML from top to bottom, creates a controller instance with its no-argument constructor, then injects every node that has an fx:id into the field with the same name. Only after that does it call the controller's initialize method.

The returned Parent is the root element of the XML, so the same file can open in a fresh Scene or be placed inside another layout. If the URL is null, the loader throws an unhelpful exception, which is why the null check above is worth the three lines.
