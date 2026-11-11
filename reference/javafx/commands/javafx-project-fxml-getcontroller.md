# FXMLLoader.getController()

JavaFX command · Controller

Returns the controller instance the loader created, so the caller can pass data in after the window is built.

## Syntax

```java
Controller c = loader.getController();
```

## Example

```java
FXMLLoader loader = new FXMLLoader(App.class.getResource("/app/bookings.fxml"));
Parent root = loader.load();

// The loader owns the constructor, so data arrives through a setter.
BookingController controller = loader.getController();
controller.setDeskName("Front desk");
```

## Details

Call getController after load. Before load it returns null.

The other direction also works and is often cleaner: the controller can reach application level objects through a small service class instead of a setter, which avoids a long chain of pass-through methods when the window gains panes.
