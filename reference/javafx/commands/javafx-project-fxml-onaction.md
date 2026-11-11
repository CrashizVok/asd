# onAction

JavaFX command · FXML

Connects a button, menu item or other action source to a controller method. The method must return void and may take no argument or one ActionEvent.

## Syntax

```java
onAction="#onSave"
```

## Example

```java
<!-- FXML -->
<Button text="Save" onAction="#onSave"/>
<MenuItem text="Open CSV..." onAction="#onOpenFile"/>
```

## Details

The handler stays private, which keeps the controller surface small:

```java
@FXML
private void onSave() {
    // the click lands here
}
```

A renamed method breaks the window at startup with "method not found", not at compile time. If the handler needs the event, declare one ActionEvent parameter; adding a second parameter makes the loader reject the method.
