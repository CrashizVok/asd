# launch()

JavaFX command · Lifecycle

Boots the JavaFX toolkit, constructs the application instance, and runs the lifecycle. Call it once from main; a second call throws IllegalStateException.

## Syntax

```java
Application.launch(args)
```

## Example

```java
public static void main(String[] args) {
    // The only entry point. Do not call launch again to open another window.
    launch(args);
}
```

## Details

Arguments reach the application through `getParameters()`. Named arguments use `--key=value` and are read with `getNamed()`; everything else is in `getRaw()`.

```java
public void init() {
    String file = getParameters().getNamed().get("file");
    System.out.println("Startup file: " + file);
}
```

Run with `mvn javafx:run -Djavafx.args="--file=data.csv"` when the exam supplies a path. If no argument is given, `get` returns `null`, so guard it.
