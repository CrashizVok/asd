# Application subclass

JavaFX command · Lifecycle

Every JavaFX program starts with a class that extends Application and overrides start. The toolkit creates one instance with the no-argument constructor and calls start on the FX thread.

## Syntax

```java
public class App extends Application { @Override public void start(Stage stage) { ... } }
```

## Example

```java
public class App extends Application {

    @Override
    public void start(Stage stage) {
        stage.setScene(new Scene(new Label("Ready"), 400, 300));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

## Details

`start` receives a stage that is already created but empty and invisible. Build the root node, wrap it in a `Scene`, attach the scene, then call `show()`.

Put file reading in `init()` or in a plain helper class. Keeping the GUI class thin means the data code can run without a display.
